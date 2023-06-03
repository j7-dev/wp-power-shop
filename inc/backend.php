<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\Backend;

use Kucrut\Vite;

class Bootstrap
{

	const PROJECT_NAME = 'fast-shop';

	public function init(): void
	{
		\add_action('wp_enqueue_scripts', [$this, 'enqueue_script']);
		\add_action('wp_footer', [$this, 'render_app']);
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







require_once __DIR__ . '/custom/includes.php';
