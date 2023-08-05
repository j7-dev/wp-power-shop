<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\PowerShop\Admin;

use Kucrut\Vite;

/**
 * [x] - 每次到快速商店就清除購物車，可以避免跨商店結帳
 * [x] - 選擇運費
 * [ ] - 使用COUPON
 */


class Bootstrap
{
	function __construct()
	{
		$_ENV['APP_NAME'];
		$_ENV['KEBAB'] = str_replace(' ', '-', strtolower($_ENV['APP_NAME']));
		$_ENV['SNAKE'] = str_replace(' ', '_', strtolower($_ENV['APP_NAME']));

		new CPT();
		new ShortCode();
		new Cart();
		new Order();
		new Ajax();
	}

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
			if (($screen->id !== $_ENV['KEBAB'])) return;
		} else {
			// 前台網頁必須包含 {$_ENV['KEBAB']} 字串 才引用
			if (strpos($_SERVER['REQUEST_URI'], $_ENV['KEBAB']) === false) return;
		}


		// if (!\is_admin() && ($screen->id !== $_ENV['KEBAB'])) return;
		Vite\enqueue_asset(
			dirname(__DIR__) . '/js/dist',
			'js/src/main.tsx',
			[
				'handle' => $_ENV['KEBAB'],
				'in-footer' => true,
			]
		);

		// get checkout url
		global $woocommerce;
		$checkout_page_url = function_exists('wc_get_cart_url') ?
			\wc_get_checkout_url() : $woocommerce->cart->get_checkout_url();

		$post_id = \get_the_ID();
		$permalink = \get_permalink($post_id);
		$elLicenseCode = \get_option('PowerShopPro_lic_Key', '');

		\wp_localize_script($_ENV['KEBAB'], 'appData', array(
			'siteUrl' => \site_url(),
			'ajaxUrl' => \admin_url('admin-ajax.php'),
			'ajaxNonce'  => \wp_create_nonce($_ENV['KEBAB']),
			'userId' => \wp_get_current_user()->data->ID,
			'postId' => $post_id,
			'permalink' => $permalink,
			'checkoutUrl' => $checkout_page_url,
			'elLicenseCode' => $elLicenseCode,
		));

		\wp_localize_script($_ENV['KEBAB'], 'wpApiSettings', array(
			'root' => \esc_url_raw(rest_url()),
			'nonce' => \wp_create_nonce('wp_rest'),
		));
	}

	public static function get_plugin_dir(): string
	{
		$plugin_dir = \wp_normalize_path(\plugin_dir_path(__FILE__ . '../'));
		return $plugin_dir;
	}

	public static function get_plugin_url(): string
	{
		$plugin_url = \plugin_dir_url(self::get_plugin_dir());
		return $plugin_url;
	}

	public static function get_plugin_ver(): string
	{
		$plugin_data = \get_plugin_data(self::get_plugin_dir());
		$plugin_ver = $plugin_data['Version'];
		return $plugin_ver;
	}
}

require_once __DIR__ . '/custom/includes.php';
