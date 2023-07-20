<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;

use J7\ViteReactWPPlugin\FastShop\Admin\Bootstrap;

class CPT extends Functions
{
	const VAR = 'ps_report';


	function __construct()
	{
		\add_action('init', [$this, 'init']);
		\add_action('load-post.php',     [$this, 'init_metabox']);
		\add_action('load-post-new.php', [$this, 'init_metabox']);

		\add_filter('query_vars', [$this, 'add_query_for_report']);
		\add_filter('template_include', [$this, 'load_report_template'], 99);
	}

	public function add_query_for_report($vars)
	{
		$vars[] = self::VAR;
		return $vars;
	}

	public function init(): void
	{
		self::register_cpt(Bootstrap::LABEL);

		// 新增 fast-shop/{slug}/report 網址規則
		\add_rewrite_rule('^' . Bootstrap::TEXT_DOMAIN . '/([^/]+)/report/?$', 'index.php?slug=$matches[1]&' . self::VAR . '=1', 'top');

		\flush_rewrite_rules();
	}

	/**
	 * Meta box initialization.
	 */
	public function init_metabox(): void
	{
		\add_action('add_meta_boxes', [$this, 'add_metaboxs']);
		\add_action('save_post',      [$this, 'save_metabox'], 10, 2);
		\add_filter('rewrite_rules_array', [$this, 'custom_post_type_rewrite_rules']);
	}


	public function custom_post_type_rewrite_rules($rules)
	{
		global $wp_rewrite;
		$wp_rewrite->flush_rules();
		return $rules;
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


	public function save_metabox($post_id, $post)
	{

		/*
		 * We need to verify this came from the our screen and with proper authorization,
		 * because save_post can be triggered at other times.
		 */

		// Check if our nonce is set.
		if (!isset($_POST['_wpnonce'])) 	return $post_id;

		$nonce = $_POST['_wpnonce'];


		/*
		 * If this is an autosave, our form has not been submitted,
		 * so we don't want to do anything.
		 */
		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return $post_id;



		// Check the user's permissions.
		if ('fast-shop' !== $_POST['post_type']) return $post_id;
		if (!\current_user_can('edit_post', $post_id)) return $post_id;

		/* OK, it's safe for us to save the data now. */

		// Sanitize the user input.
		$meta_data = \sanitize_text_field($_POST[Bootstrap::DB_DOMAIN . '_meta']);


		// Update the meta field.
		\update_post_meta($post_id, Bootstrap::DB_DOMAIN . '_meta', $meta_data);
	}

	/**
	 * 設定 fast-shop/{slug}/report 的 php template
	 */
	public function load_report_template($template)
	{
		$repor_template_path = Bootstrap::PLUGIN_DIR . 'inc\templates\report.php';

		if (\get_query_var(self::VAR)) {
			if (file_exists($repor_template_path)) {
				return $repor_template_path;
			}
		}
		return $template;
	}
}
