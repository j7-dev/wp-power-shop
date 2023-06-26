<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;

use Kucrut\Vite;

class Bootstrap
{

	const TEXT_DOMAIN = 'fast-shop';
	const DB_DOMAIN = 'fast_shop';
	const LABEL = 'Fast Shop';
	const ACTION = 'handle_cart_price';


	public function init(): void
	{
		\add_action('admin_enqueue_scripts', [$this, 'enqueue_script']);
		\add_action('wp_enqueue_scripts', [$this, 'enqueue_script']);
		\add_action('wp_ajax_' . self::ACTION, [$this,  self::ACTION . '_callback']);
		\add_action('wp_ajax_nopriv_' . self::ACTION, [$this, self::ACTION . '_callback']);

		// \add_action('wp_footer', [$this, 'render_app']);
	}

	/**
	 * Render application's markup
	 */
	public function render_app(): void
	{
		\printf('<div id="my-app" class="my-app"></div>');
	}


	/**
	 * Enqueue script
	 */
	public function enqueue_script(): void
	{
		if (\is_admin()) {
			// 後台網頁 screen id 必須符合才引入
			$screen = \get_current_screen();
			if (($screen->id !== 'fast-shop')) return;
		} else {
			// 前台網頁必須包含 fast-shop 字串 才引用
			if (strpos($_SERVER['REQUEST_URI'], 'fast-shop') === false) return;
		}


		// if (!\is_admin() && ($screen->id !== 'fast-shop')) return;
		Vite\enqueue_asset(
			dirname(__DIR__) . '/js/dist',
			'js/src/main.tsx',
			[
				'handle' => self::TEXT_DOMAIN,
				'in-footer' => true,
			]
		);

		\wp_localize_script(self::TEXT_DOMAIN, 'appData', array(
			'ajaxUrl' => \admin_url('admin-ajax.php'),
			'ajaxNonce'  => \wp_create_nonce(self::TEXT_DOMAIN),
			'ajaxAction' => self::ACTION,
			'userId' => \wp_get_current_user()->data->ID,
			'postId' => \get_the_ID(),
		));

		\wp_localize_script(self::TEXT_DOMAIN, 'wpApiSettings', array(
			'root' => \esc_url_raw(rest_url()),
			'nonce' => \wp_create_nonce('wp_rest'),
		));
	}

	public function handle_cart_price_callback()
	{
		// Security check
		\check_ajax_referer(self::TEXT_DOMAIN, 'nonce');

		// global $woocommerce;

		$product_id = $_POST['id'];
		$quantity = $_POST['quantity'];
		$variationId = $_POST['variationId'];
		$variation = $_POST['variation'];
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
		\WC()->cart->add_to_cart($product_id, $quantity);

		$return = array(
			'message'  => 'success',
			'data'       => [
				'product_id' => $product_id,
				'quantity' => $quantity,
			]
		);

		\wp_send_json($return);

		\wp_die();
	}
}

require_once __DIR__ . '/custom/includes.php';




new CPT();
new ShortCode();
