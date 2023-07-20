<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;

use Kucrut\Vite;

/**
 * [x] - 每次到快速商店就清除購物車，可以避免跨商店結帳
 * [x] - 選擇運費
 * [ ] - 使用COUPON
 */


class Bootstrap
{

	const TEXT_DOMAIN = 'fast-shop';
	const DB_DOMAIN = 'fast_shop';
	const LABEL = 'Fast Shop';
	const PLUGIN_DIR = __DIR__ . '/../';
	const META_KEY = 'fast_shop_meta';

	public function init(): void
	{
		\add_action('admin_enqueue_scripts', [$this, 'enqueue_script'], 99);
		\add_action('wp_enqueue_scripts', [$this, 'enqueue_script'], 99);
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

		// get checkout url
		global $woocommerce;
		$checkout_page_url = function_exists('wc_get_cart_url') ?
			\wc_get_checkout_url() : $woocommerce->cart->get_checkout_url();

		$post_id = \get_the_ID();
		$permalink = \get_permalink($post_id);

		\wp_localize_script(self::TEXT_DOMAIN, 'appData', array(
			'siteUrl' => \site_url(),
			'ajaxUrl' => \admin_url('admin-ajax.php'),
			'ajaxNonce'  => \wp_create_nonce(self::TEXT_DOMAIN),
			'userId' => \wp_get_current_user()->data->ID,
			'postId' => $post_id,
			'permalink' => $permalink,
			'checkoutUrl' => $checkout_page_url,
		));

		\wp_localize_script(self::TEXT_DOMAIN, 'wpApiSettings', array(
			'root' => \esc_url_raw(rest_url()),
			'nonce' => \wp_create_nonce('wp_rest'),
		));
	}
}

require_once __DIR__ . '/custom/includes.php';




new CPT();
new ShortCode();
new Cart();
new Order();
new Ajax();
