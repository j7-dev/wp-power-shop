<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\Frontend;

use Kucrut\Vite;

class Bootstrap
{

	const PROJECT_NAME = 'your-project';

	function __construct()
	{
		add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_script']);
		add_action('wp_footer', [__CLASS__, 'render_app']);
	}

	/**
	 * Render application's markup
	 */
	public static function render_app(): void
	{
		printf('<div id="my-app" class="my-app"></div>');
	}


	/**
	 * Enqueue script
	 */
	public static function enqueue_script(): void
	{
		Vite\enqueue_asset(
			dirname(__DIR__) . '/js/dist',
			'js/src/main.tsx',
			[
				'handle' => self::PROJECT_NAME,
				'in-footer' => true,
			]
		);

		\wp_localize_script(self::PROJECT_NAME, 'appData', array(
			'apiUrl' => \site_url() . '/wp-json',
			'userId' => \wp_get_current_user()->data->ID,
		));

		\wp_localize_script(self::PROJECT_NAME, 'wpApiSettings', array(
			'root' => \esc_url_raw(rest_url()),
			'nonce' => \wp_create_nonce('wp_rest'),
		));
	}
}







include_once __DIR__ . '/custom/includes.php';
