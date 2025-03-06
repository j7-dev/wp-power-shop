<?php
/**
 * Custom Post Type: Power Shop
 */

declare(strict_types=1);

namespace J7\PowerShop\Admin;

use J7\PowerShop\Utils\Base;
use J7\PowerShop\Plugin;

if (class_exists('J7\PowerShop\Admin\CPT')) {
	return;
}
/** Class CPT */
final class CPT {
	use \J7\WpUtils\Traits\SingletonTrait;

	const POST_TYPE = 'power-shop';

	/** Constructor */
	public function __construct() {
		\add_action( 'init', [ $this, 'register_cpt' ] );
		\add_action( 'load-post.php', [ $this, 'add_metabox' ] );
		\add_action( 'load-post-new.php', [ $this, 'add_metabox' ] );
	}

	/**
	 * Register power-shop custom post type
	 */
	public static function register_cpt(): void {

		$labels = [
			'name'                     => \esc_html__( 'power-shop', 'power_shop' ),
			'singular_name'            => \esc_html__( 'power-shop', 'power_shop' ),
			'add_new'                  => \esc_html__( 'Add new', 'power_shop' ),
			'add_new_item'             => \esc_html__( 'Add new item', 'power_shop' ),
			'edit_item'                => \esc_html__( 'Edit', 'power_shop' ),
			'new_item'                 => \esc_html__( 'New', 'power_shop' ),
			'view_item'                => \esc_html__( 'View', 'power_shop' ),
			'view_items'               => \esc_html__( 'View', 'power_shop' ),
			'search_items'             => \esc_html__( 'Search power-shop', 'power_shop' ),
			'not_found'                => \esc_html__( 'Not Found', 'power_shop' ),
			'not_found_in_trash'       => \esc_html__( 'Not found in trash', 'power_shop' ),
			'parent_item_colon'        => \esc_html__( 'Parent item', 'power_shop' ),
			'all_items'                => \esc_html__( 'All', 'power_shop' ),
			'archives'                 => \esc_html__( 'power-shop archives', 'power_shop' ),
			'attributes'               => \esc_html__( 'power-shop attributes', 'power_shop' ),
			'insert_into_item'         => \esc_html__( 'Insert to this power-shop', 'power_shop' ),
			'uploaded_to_this_item'    => \esc_html__( 'Uploaded to this power-shop', 'power_shop' ),
			'featured_image'           => \esc_html__( 'Featured image', 'power_shop' ),
			'set_featured_image'       => \esc_html__( 'Set featured image', 'power_shop' ),
			'remove_featured_image'    => \esc_html__( 'Remove featured image', 'power_shop' ),
			'use_featured_image'       => \esc_html__( 'Use featured image', 'power_shop' ),
			'menu_name'                => \esc_html__( 'power-shop', 'power_shop' ),
			'filter_items_list'        => \esc_html__( 'Filter power-shop list', 'power_shop' ),
			'filter_by_date'           => \esc_html__( 'Filter by date', 'power_shop' ),
			'items_list_navigation'    => \esc_html__( 'power-shop list navigation', 'power_shop' ),
			'items_list'               => \esc_html__( 'power-shop list', 'power_shop' ),
			'item_published'           => \esc_html__( 'power-shop published', 'power_shop' ),
			'item_published_privately' => \esc_html__( 'power-shop published privately', 'power_shop' ),
			'item_reverted_to_draft'   => \esc_html__( 'power-shop reverted to draft', 'power_shop' ),
			'item_scheduled'           => \esc_html__( 'power-shop scheduled', 'power_shop' ),
			'item_updated'             => \esc_html__( 'power-shop updated', 'power_shop' ),
		];
		$args   = [
			'label'                 => \esc_html__( 'power-shop', 'power_shop' ),
			'labels'                => $labels,
			'description'           => '',
			'public'                => true,
			'hierarchical'          => false,
			'exclude_from_search'   => true,
			'publicly_queryable'    => true,
			'show_ui'               => true,
			'show_in_nav_menus'     => false,
			'show_in_admin_bar'     => false,
			'show_in_rest'          => true,
			'query_var'             => false,
			'can_export'            => true,
			'delete_with_user'      => true,
			'has_archive'           => false,
			'rest_base'             => '',
			'show_in_menu'          => true,
			'menu_position'         => 6,
			'menu_icon'             => 'dashicons-store',
			'capability_type'       => 'post',
			'supports'              => [ 'title', 'editor', 'thumbnail', 'custom-fields', 'author' ],
			'taxonomies'            => [],
			'rest_controller_class' => 'WP_REST_Posts_Controller',
			'rewrite'               => [
				'with_front' => true,
			],
		];

		\register_post_type( self::POST_TYPE, $args );
	}


	/**
	 * Adds the meta box.
	 *
	 * @param string $post_type Post type.
	 */
	public function add_metabox( string $post_type ): void {
		$post_type = $post_type ?: $_GET['post_type']; // phpcs:ignore
		if ( in_array( $post_type, [ self::POST_TYPE ] ) ) {
			\add_meta_box(
				self::POST_TYPE . '-metabox',
				__( 'Power Shop', 'power_shop' ),
				[ $this, 'render_meta_box' ],
				self::POST_TYPE,
				'advanced',
				'high'
			);
		}
	}

	/**
	 * Render meta box.
	 */
	public function render_meta_box(): void {
		// phpcs:ignore
		echo '<div id="' . substr(Base::APP2_SELECTOR, 1) . '" class="relative"></div>';
	}
}
