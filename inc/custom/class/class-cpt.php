<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\Custom;


// use J7\ViteReactWPPlugin\Backend;


class CPT
{

	function __construct()
	{
		add_action('init', [$this, 'register_cpt']);
	}

	public function register_cpt(): void
	{
		$labels = [
			'name'                     => esc_html__('Fast Shop', 'fast-shop'),
			'singular_name'            => esc_html__('Fast Shop', 'fast-shop'),
			'add_new'                  => esc_html__('Add new', 'fast-shop'),
			'add_new_item'             => esc_html__('Add new item', 'fast-shop'),
			'edit_item'                => esc_html__('Edit', 'fast-shop'),
			'new_item'                 => esc_html__('New', 'fast-shop'),
			'view_item'                => esc_html__('View', 'fast-shop'),
			'view_items'               => esc_html__('View', 'fast-shop'),
			'search_items'             => esc_html__('Search Fast Shop', 'fast-shop'),
			'not_found'                => esc_html__('Not Found', 'fast-shop'),
			'not_found_in_trash'       => esc_html__('Not found in trash', 'fast-shop'),
			'parent_item_colon'        => esc_html__('Parent item', 'fast-shop'),
			'all_items'                => esc_html__('All', 'fast-shop'),
			'archives'                 => esc_html__('Fast Shop archives', 'fast-shop'),
			'attributes'               => esc_html__('Fast Shop attributes', 'fast-shop'),
			'insert_into_item'         => esc_html__('Insert to this Fast Shop', 'fast-shop'),
			'uploaded_to_this_item'    => esc_html__('Uploaded to this Fast Shop', 'fast-shop'),
			'featured_image'           => esc_html__('Featured image', 'fast-shop'),
			'set_featured_image'       => esc_html__('Set featured image', 'fast-shop'),
			'remove_featured_image'    => esc_html__('Remove featured image', 'fast-shop'),
			'use_featured_image'       => esc_html__('Use featured image', 'fast-shop'),
			'menu_name'                => esc_html__('Fast Shop', 'fast-shop'),
			'filter_items_list'        => esc_html__('Filter Fast Shop list', 'fast-shop'),
			'filter_by_date'           => esc_html__('Filter by date', 'fast-shop'),
			'items_list_navigation'    => esc_html__('Fast Shop list navigation', 'fast-shop'),
			'items_list'               => esc_html__('Fast Shop list', 'fast-shop'),
			'item_published'           => esc_html__('Fast Shop published', 'fast-shop'),
			'item_published_privately' => esc_html__('Fast Shop published privately', 'fast-shop'),
			'item_reverted_to_draft'   => esc_html__('Fast Shop reverted to draft', 'fast-shop'),
			'item_scheduled'           => esc_html__('Fast Shop scheduled', 'fast-shop'),
			'item_updated'             => esc_html__('Fast Shop updated', 'fast-shop'),
			'text_domain'              => esc_html__('fast-shop', 'fast-shop'),
		];
		$args = [
			'label'               => esc_html__('Fast Shop', 'fast-shop'),
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
			'rewrite'             => [
				'with_front' => false,
			],
		];

		// register_meta('post', 'project_data', [
		// 	'type' => 'string',
		// 	'show_in_rest' => true,
		// 	'single' => true,
		// ]);

		register_post_type('fast-shop', $args);
	}
}

new CPT();
