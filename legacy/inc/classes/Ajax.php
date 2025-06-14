<?php

declare(strict_types=1);

namespace J7\PowerShopV2;

use J7\PowerShop\Plugin;

final class Ajax {
	use \J7\WpUtils\Traits\SingletonTrait;


	const GET_POST_META_ACTION    = 'ps_handle_get_post_meta';
	const UPDATE_POST_META_ACTION = 'handle_update_post_meta';

	function __construct() {
		foreach ([ self::GET_POST_META_ACTION, self::UPDATE_POST_META_ACTION ] as $action) {
			\add_action('wp_ajax_' . $action, [ $this, $action . '_callback' ]);
			\add_action('wp_ajax_nopriv_' . $action, [ $this, $action . '_callback' ]);
		}
	}

	public function ps_handle_get_post_meta_callback() {
		// Security check
		\check_ajax_referer(Plugin::$kebab, 'nonce');
		$post_id  = \sanitize_text_field($_POST['post_id'] ?? '');
		$meta_key = \sanitize_text_field($_POST['meta_key'] ?? '');

		if (empty($post_id)) {
			return;
		}

		$post_id   = $post_id;
		$post_meta = empty($meta_key) ? \get_post_meta($post_id) : \get_post_meta($post_id, $meta_key, true);

		$return = [
			'message' => 'success',
			'data'    => [
				'post_meta' => $post_meta,
			],
		];

		\wp_send_json($return);

		\wp_die();
	}

	public function handle_update_post_meta_callback() {
		// Security check
		\check_ajax_referer(Plugin::$kebab, 'nonce');
		$post_id    = \sanitize_text_field($_POST['post_id'] ?? '');
		$meta_key   = \sanitize_text_field($_POST['meta_key'] ?? '');
		$meta_value = \sanitize_text_field($_POST['meta_value'] ?? '');

		if (empty($post_id) || empty($meta_key)) {
			return;
		}

		$post_id       = $post_id;
		$update_result = \update_post_meta($post_id, $meta_key, $meta_value);

		$return = [
			'message' => 'success',
			'data'    => [
				'update_result' => $update_result,
			],
		];

		\wp_send_json($return);

		\wp_die();
	}
}
