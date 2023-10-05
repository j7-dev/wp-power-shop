<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\PowerShop\Admin;

use Kucrut\Vite;

/**
 * [ ] - 使用COUPON
 */



class Bootstrap
{
	function __construct()
	{
		$_ENV['APP_NAME'];
		$_ENV['KEBAB'] = str_replace(' ', '-', strtolower($_ENV['APP_NAME']));
		$_ENV['SNAKE'] = str_replace(' ', '_', strtolower($_ENV['APP_NAME']));
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
		$products_info = Functions::get_products_info($post_id);


		// 找出指定的 meta_id by meta_key
		global $wpdb;
		$power_shop_meta_meta_id = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT meta_id FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = %s",
				$post_id,
				$_ENV['SNAKE'] . '_meta'
			)
		);
		$power_shop_report_password_meta_id = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT meta_id FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = %s",
				$post_id,
				$_ENV['SNAKE'] . '_report_password'
			)
		);
		$power_shop_settings_meta_id = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT meta_id FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = %s",
				$post_id,
				$_ENV['SNAKE'] . '_settings'
			)
		);


		\wp_localize_script($_ENV['KEBAB'], 'appData', array(
			'siteUrl' => \site_url(),
			'ajaxUrl' => \admin_url('admin-ajax.php'),
			'ajaxNonce'  => \wp_create_nonce($_ENV['KEBAB']),
			'userId' => \wp_get_current_user()->data->ID,
			'postId' => $post_id,
			'metaIds' => [
				'power_shop_meta' => $power_shop_meta_meta_id,
				'power_shop_report_password' => $power_shop_report_password_meta_id,
				'power_shop_settings' => $power_shop_settings_meta_id,
			],
			'permalink' => $permalink,
			'checkoutUrl' => $checkout_page_url,
			'elLicenseCode' => $elLicenseCode,
			'products_info' => $products_info,
		));

		\wp_localize_script($_ENV['KEBAB'], 'wpApiSettings', array(
			'root' => \esc_url_raw(rest_url()),
			'nonce' => \wp_create_nonce('wp_rest'),
		));

		// 获取目录中的所有文件
		$files = glob(self::get_plugin_dir() . '/js/dist/assets/*.css');

		// 遍历文件并使用wp_enqueue_style加载它们
		foreach ($files as $file) {
			$file_url = self::get_plugin_url() . '/js/dist/assets/' . basename($file);
			\wp_enqueue_style(basename($file, '.css'), $file_url);
		}
	}

	public static function get_plugin_dir(): string
	{
		$plugin_dir = \wp_normalize_path(\plugin_dir_path(__DIR__ . '../'));
		return $plugin_dir;
	}

	public static function get_plugin_url(): string
	{
		$plugin_url = \plugin_dir_url(self::get_plugin_dir() . 'plugin.php');
		return $plugin_url;
	}

	public static function get_plugin_ver(): string
	{
		$plugin_data = \get_plugin_data(self::get_plugin_dir() . 'plugin.php');
		$plugin_ver = $plugin_data['Version'];
		return $plugin_ver;
	}
}
