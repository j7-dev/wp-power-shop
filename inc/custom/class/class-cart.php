<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\PowerShop\Admin;

use J7\ViteReactWPPlugin\PowerShop\Admin\Bootstrap;
use function _\find;

class Cart
{

	const ADD_CART_ACTION = 'handle_add_cart';
	const REMOVE_CART_ACTION = 'handle_remove_cart';
	const GET_CART_ACTION = 'handle_get_cart';



	function __construct()
	{
		\add_action('woocommerce_before_calculate_totals', [$this, 'price_refresh']);
		foreach ([
			self::ADD_CART_ACTION,
			self::REMOVE_CART_ACTION,
			self::GET_CART_ACTION,
		] as $action) {
			\add_action('wp_ajax_' . $action, [$this,  $action . '_callback']);
			\add_action('wp_ajax_nopriv_' . $action, [$this, $action . '_callback']);
		}
		\add_action('woocommerce_checkout_create_order_line_item', [$this, 'save_custom_data_to_order_meta'], 10, 4);
	}

	public function price_refresh($cart_object)
	{

		foreach ($cart_object->get_cart_contents() as $key => $item) {
			if (!empty($item[$_ENV['SNAKE'] . '_sales_price'])) {
				$item['data']->set_price($item[$_ENV['SNAKE'] . '_sales_price']);
			}
			if (!empty($item[$_ENV['SNAKE'] . '_regular_price'])  && empty($item[$_ENV['SNAKE'] . '_sales_price'])) {
				$item['data']->set_price($item[$_ENV['SNAKE'] . '_regular_price']);
			}
		}
	}


	public function handle_add_cart_callback()
	{
		// Security check
		\check_ajax_referer($_ENV['KEBAB'], 'nonce');

		// global $woocommerce;
		$post_id = \sanitize_text_field($_POST['post_id'] ?? 0);
		if (empty($post_id)) return;
		$product_id = \sanitize_text_field($_POST['id'] ?? 0);
		$quantity = \sanitize_text_field($_POST['quantity'] ?? 1);
		$variation_id = \sanitize_text_field($_POST['variation_id'] ?? 0);
		$variation_stringfy = \sanitize_text_field($_POST['variation'] ?? '[]');
		$shop_meta_string = \get_post_meta($post_id, $_ENV['SNAKE'] . '_meta', true) ?? '[]';

		try {
			$variation_obj_arr = json_decode(str_replace('\\', '', $variation_stringfy));
			$variation = [];
			foreach ($variation_obj_arr as $variation_obj) {
				$variation[$variation_obj->name] = $variation_obj->value;
			}

			$shop_meta = (json_decode($shop_meta_string, true));
		} catch (\Throwable $th) {
			$variation = [];
			$shop_meta = [];
		}

		$the_product_meta = find($shop_meta, ['productId' => $product_id]) ?? [];

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


		if (empty($variation_id)) {
			// 加入購物車 簡單商品
			\WC()->cart->add_to_cart($product_id, $quantity, 0, [], [
				$_ENV['SNAKE'] . '_regular_price' => $the_product_meta['regularPrice'],
				$_ENV['SNAKE'] . '_sales_price' => $the_product_meta['salesPrice'],
				$_ENV['SNAKE'] . '_post_id' => $post_id,
			]);
		} else {
			// 加入購物車 可變商品
			$the_variations_meta = $the_product_meta['variations'] ?? [];
			$the_variation_meta = find($the_variations_meta, ['variationId' => $variation_id]) ?? [];
			\WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $variation, [
				$_ENV['SNAKE'] . '_regular_price' => $the_variation_meta['regularPrice'],
				$_ENV['SNAKE'] . '_sales_price' => $the_variation_meta['salesPrice'],
				$_ENV['SNAKE'] . '_post_id' => $post_id,
			]);
		}

		$totals = \WC()->cart->get_totals();

		// NOTE 上線後刪除
		$return = array(
			'message'  => 'success',
			'data'       => [
				'product_id' => $product_id,
				'quantity' => $quantity,
				'variation_id' => $variation_id,
				'variation' => $variation,
				'variable' => $_POST,
				'empty' => empty($variation_id),
				'shop_meta' => $shop_meta,
				'the_product_meta' => $the_product_meta,
				'the_variation_meta' => $the_variation_meta,
				'totals' => $totals,
			]
		);

		\wp_send_json($return);


		\wp_die();
	}

	public function handle_remove_cart_callback()
	{
		// Security check
		\check_ajax_referer($_ENV['KEBAB'], 'nonce');

		$cart_item_key = \sanitize_text_field($_POST['cart_item_key'] ?? '');

		\WC()->cart->remove_cart_item($cart_item_key);

		// NOTE 上線後刪除
		$return = array(
			'message'  => 'success',
			'data'       => [
				'variable' => $_POST,
			]
		);

		\wp_send_json($return);

		\wp_die();
	}

	public function handle_get_cart_callback()
	{
		// Security check
		\check_ajax_referer($_ENV['KEBAB'], 'nonce');

		$totals = \WC()->cart->get_totals();

		// NOTE 上線後刪除
		$return = array(
			'message'  => 'success',
			'data'       => [
				'variable' => $_POST,
				'totals' => $totals,
			]
		);

		\wp_send_json($return);

		\wp_die();
	}

	public function save_custom_data_to_order_meta($item, $cart_item_key, $values, $order)
	{
		$meta_key = $_ENV['SNAKE'] . '_post_id';
		if (isset($values[$meta_key])) {
			$order->update_meta_data($meta_key, $values[$meta_key]);
		}
	}
}
