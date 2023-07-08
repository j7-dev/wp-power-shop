<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;

use J7\ViteReactWPPlugin\FastShop\Admin\Bootstrap;

class Ajax
{

	const GET_POST_META_ACTION = 'handle_get_post_meta';



	function __construct()
	{
		foreach ([self::GET_POST_META_ACTION] as $action) {
				\add_action('wp_ajax_' . $action, [$this,  $action . '_callback']);
				\add_action('wp_ajax_nopriv_' . $action, [$this, $action . '_callback']);
		}

	}


	public function handle_get_post_meta_callback()
	{
		// Security check
		\check_ajax_referer(Bootstrap::TEXT_DOMAIN, 'nonce');

		if(!isset($_POST['post_id'])) return;
		$post_id = $_POST['post_id'];
		$meta_key = $_POST['meta_key'] ?? '';
		$post_meta = empty($meta_key) ? \get_post_meta($post_id) : \get_post_meta($post_id, $meta_key, true);

		$return = array(
			'message'  => 'success',
			'data'       => [
				'post_meta' => $post_meta,
			]
		);

		\wp_send_json($return);

		\wp_die();
	}




}
