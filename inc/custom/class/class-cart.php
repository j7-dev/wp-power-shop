<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;

use J7\ViteReactWPPlugin\FastShop\Admin\Bootstrap;
use function _\find;

class Cart
{

	const ADD_CART_ACTION = 'handle_add_cart';
	const REMOVE_CART_ACTION = 'handle_remove_cart';


	function __construct()
	{
		\add_action('woocommerce_before_calculate_totals', [$this, 'rudr_custom_price_refresh']);
		\add_action('wp_ajax_' . self::ADD_CART_ACTION, [$this,  self::ADD_CART_ACTION . '_callback']);
		\add_action('wp_ajax_nopriv_' . self::ADD_CART_ACTION, [$this, self::ADD_CART_ACTION . '_callback']);
		\add_action('wp_ajax_' . self::REMOVE_CART_ACTION, [$this,  self::REMOVE_CART_ACTION . '_callback']);
		\add_action('wp_ajax_nopriv_' . self::REMOVE_CART_ACTION, [$this, self::REMOVE_CART_ACTION . '_callback']);
	}



	public function rudr_custom_price_refresh()
	{

	}


	public function handle_add_cart_callback()
	{
		// Security check
		\check_ajax_referer(Bootstrap::TEXT_DOMAIN, 'nonce');

		// global $woocommerce;
		$post_id = $_POST['post_id'] ?? 0;
		if(empty($post_id)) return;
		$product_id = $_POST['id'];
		$quantity = $_POST['quantity'];
		$variation_id = $_POST['variation_id'] ?? 0;
		$variation_stringfy = $_POST['variation'] ?? '[]';
		$fast_shop_meta_string = get_post_meta($post_id, Bootstrap::META_KEY, true) ?? '[]';

		try {
			$variation_obj_arr = json_decode(str_replace('\\', '',$variation_stringfy));
			$variation = [];
			foreach ($variation_obj_arr as $variation_obj) {
				$variation[$variation_obj->name] = $variation_obj->value;
			}

			$fast_shop_meta = (json_decode($fast_shop_meta_string, true));
		} catch (\Throwable $th) {
			$variation = [];
			$fast_shop_meta = [];
		}

		$the_product_meta = find($fast_shop_meta, ['productId' => $product_id]) ?? [];

		/**
		  * @throws Exception Plugins can throw an exception to prevent adding to cart.
			* @param int   $product_id contains the id of the product to add to the cart.
			* @param int   $quantity contains the quantity of the item to add.
			* @param int   $variation_id ID of the variation being added to the cart.
			* @param array $variation attribute values.
			* @param array $cart_item_data extra cart item data we want to pass into the item.
			* @return string|bool $cart_item_key
			* add_to_cart( $product_id = 0, $quantity = 1, $variation_id = 0, $variation = array(), $cart_item_data = array() )
		 */

		 // 加入購物車 簡單商品
		 if(empty($variation_id)){
			\WC()->cart->add_to_cart($product_id, $quantity, 0, [], [
				'regular_price' => $the_product_meta['regularPrice'],
				'sale_price' => $the_product_meta['salePrice'],
			]);
		 }else{
			// 加入購物車 可變商品
			$the_variations_meta = $the_product_meta['variations'] ?? [];
			$the_variation_meta = find($the_variations_meta, ['variationId' => $variation_id]) ?? [];
			\WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $variation, [
				'regular_price' => $the_variation_meta['regularPrice'],
				'sale_price' => $the_variation_meta['salePrice'],
			]);
		 }

		$return = array(
			'message'  => 'success',
			'data'       => [
				'product_id' => $product_id,
				'quantity' => $quantity,
				'variation_id' => $variation_id,
				'variation' => $variation,
				'variable' => $_POST,
				'empty' => empty($variation_id),
				'fast_shop_meta' => $fast_shop_meta
			]
		);

		\wp_send_json($return);

		\wp_die();
	}

	public function handle_remove_cart_callback()
	{
		// Security check
		\check_ajax_referer(Bootstrap::TEXT_DOMAIN, 'nonce');


		$cart_item_key = $_POST['cart_item_key'] ?? '';


		\WC()->cart->remove_cart_item($cart_item_key);

		$return = array(
			'message'  => 'success',
			'data'       => [
				'variable' => $_POST,
			]
		);

		\wp_send_json($return);

		\wp_die();
	}

}
