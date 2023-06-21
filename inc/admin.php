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

	private function handle_cart_price_callback()
	{
		// Security check
		\check_ajax_referer(self::TEXT_DOMAIN, 'nonce');

		$return = array(
			'message'  => 'Success!',
			'ID'       => 1
		);

		\wp_send_json($return);
	}
}

require_once __DIR__ . '/custom/includes.php';




new CPT();
new ShortCode();
