<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;


use J7\ViteReactWPPlugin\FastShop\Admin\Bootstrap;


class CPT extends Functions
{

	function __construct()
	{

		if (is_admin()) {
			add_action('init', [$this, 'init']);
			add_action('load-post.php',     [$this, 'init_metabox']);
			add_action('load-post-new.php', [$this, 'init_metabox']);
		}
	}

	public function init(): void
	{
		self::register_cpt(Bootstrap::LABEL);
	}

	/**
	 * Meta box initialization.
	 */
	public function init_metabox(): void
	{
		add_action('add_meta_boxes', [$this, 'add_metaboxs']);
		// add_action('save_post',      [$this, 'save_metabox'], 10, 2);
	}

	/**
	 * Adds the meta box.
	 */
	public function add_metaboxs(): void
	{
		self::add_metabox([
			'id'       => 'added_products',
			'label' 	=> __('Added Products', Bootstrap::TEXT_DOMAIN),
		]);
		self::add_metabox([
			'id'       => 'sales_stats',
			'label' 	=> __('Sales Stats', Bootstrap::TEXT_DOMAIN),
		]);
	}


	// public function save_metabox($post_id, $post)
	// {
	// 	// Add nonce for security and authentication.
	// 	$nonce_name   = isset($_POST['custom_nonce']) ? $_POST['custom_nonce'] : '';
	// 	$nonce_action = 'custom_nonce_action';

	// 	// Check if nonce is valid.
	// 	if (!wp_verify_nonce($nonce_name, $nonce_action)) {
	// 		return;
	// 	}

	// 	// Check if user has permissions to save data.
	// 	if (!current_user_can('edit_post', $post_id)) {
	// 		return;
	// 	}

	// 	// Check if not an autosave.
	// 	if (wp_is_post_autosave($post_id)) {
	// 		return;
	// 	}

	// 	// Check if not a revision.
	// 	if (wp_is_post_revision($post_id)) {
	// 		return;
	// 	}
	// }
}
