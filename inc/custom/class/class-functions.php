<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;


use J7\ViteReactWPPlugin\FastShop\Admin\Bootstrap;

class Functions
{
	public static function register_cpt($label): void
	{
		$labels = [
			'name'                     => esc_html__($label, Bootstrap::TEXT_DOMAIN),
			'singular_name'            => esc_html__($label, Bootstrap::TEXT_DOMAIN),
			'add_new'                  => esc_html__('Add new', Bootstrap::TEXT_DOMAIN),
			'add_new_item'             => esc_html__('Add new item', Bootstrap::TEXT_DOMAIN),
			'edit_item'                => esc_html__('Edit', Bootstrap::TEXT_DOMAIN),
			'new_item'                 => esc_html__('New', Bootstrap::TEXT_DOMAIN),
			'view_item'                => esc_html__('View', Bootstrap::TEXT_DOMAIN),
			'view_items'               => esc_html__('View', Bootstrap::TEXT_DOMAIN),
			'search_items'             => esc_html__('Search ' . $label, Bootstrap::TEXT_DOMAIN),
			'not_found'                => esc_html__('Not Found', Bootstrap::TEXT_DOMAIN),
			'not_found_in_trash'       => esc_html__('Not found in trash', Bootstrap::TEXT_DOMAIN),
			'parent_item_colon'        => esc_html__('Parent item', Bootstrap::TEXT_DOMAIN),
			'all_items'                => esc_html__('All', Bootstrap::TEXT_DOMAIN),
			'archives'                 => esc_html__($label . ' archives', Bootstrap::TEXT_DOMAIN),
			'attributes'               => esc_html__($label . ' attributes', Bootstrap::TEXT_DOMAIN),
			'insert_into_item'         => esc_html__('Insert to this ' . $label, Bootstrap::TEXT_DOMAIN),
			'uploaded_to_this_item'    => esc_html__('Uploaded to this ' . $label, Bootstrap::TEXT_DOMAIN),
			'featured_image'           => esc_html__('Featured image', Bootstrap::TEXT_DOMAIN),
			'set_featured_image'       => esc_html__('Set featured image', Bootstrap::TEXT_DOMAIN),
			'remove_featured_image'    => esc_html__('Remove featured image', Bootstrap::TEXT_DOMAIN),
			'use_featured_image'       => esc_html__('Use featured image', Bootstrap::TEXT_DOMAIN),
			'menu_name'                => esc_html__($label, Bootstrap::TEXT_DOMAIN),
			'filter_items_list'        => esc_html__('Filter ' . $label . ' list', Bootstrap::TEXT_DOMAIN),
			'filter_by_date'           => esc_html__('Filter by date', Bootstrap::TEXT_DOMAIN),
			'items_list_navigation'    => esc_html__($label . ' list navigation', Bootstrap::TEXT_DOMAIN),
			'items_list'               => esc_html__($label . ' list', Bootstrap::TEXT_DOMAIN),
			'item_published'           => esc_html__($label . ' published', Bootstrap::TEXT_DOMAIN),
			'item_published_privately' => esc_html__($label . ' published privately', Bootstrap::TEXT_DOMAIN),
			'item_reverted_to_draft'   => esc_html__($label . ' reverted to draft', Bootstrap::TEXT_DOMAIN),
			'item_scheduled'           => esc_html__($label . ' scheduled', Bootstrap::TEXT_DOMAIN),
			'item_updated'             => esc_html__($label . ' updated', Bootstrap::TEXT_DOMAIN),
			'text_domain'              => esc_html__(Bootstrap::TEXT_DOMAIN, Bootstrap::TEXT_DOMAIN),
		];
		$args = [
			'label'               => esc_html__($label, Bootstrap::TEXT_DOMAIN),
			'labels'              => $labels,
			'description'         => '',
			'public'              => true,
			'hierarchical'        => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => false,
			'show_ui'             => true,
			'show_in_nav_menus'   => false,
			'show_in_admin_bar'   => false,
			'show_in_rest'        => true,
			'query_var'           => false,
			'can_export'          => true,
			'delete_with_user'    => true,
			'has_archive'         => false,
			'rest_base'           => '',
			'show_in_menu'        => true,
			'menu_position'       => 4,
			'menu_icon'           => 'dashicons-store',
			'capability_type'     => 'post',
			'supports'            => ['title', 'editor', 'thumbnail', 'custom-fields', 'author'],
			'taxonomies'          => [],
			'rest_controller_class' => 'WP_REST_Posts_Controller',
			'rewrite'             => [
				'with_front' => true,
			],
		];

		register_meta('post', Bootstrap::DB_DOMAIN . '_meta', [
			'type' => 'string',
			'show_in_rest' => true,
			'single' => true,
		]);

		register_post_type(Bootstrap::TEXT_DOMAIN, $args);
	}
	public static function add_metabox(array $args): void
	{
		\add_meta_box(
			$args['id'],
			__($args['label'], Bootstrap::TEXT_DOMAIN),
			array(__CLASS__, 'render_metabox'),
			Bootstrap::TEXT_DOMAIN,
			'advanced',
			'default',
			array('id' => $args['id'])
		);
	}

	/**
	 * Renders the meta box.
	 */
	public static function render_metabox($post, $metabox): void
	{
		echo "<div id='{$metabox['args']['id']}_app'></div>";
	}
}
