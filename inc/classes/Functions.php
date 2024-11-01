<?php

declare (strict_types = 1);

namespace J7\PowerShop;

use function _\find;

final class Functions {

	/**
	 * Register CPT
	 *
	 * @param string $label - the name of CPT
	 * @param array  $meta_keys - the meta keys of CPT ex ['meta', 'settings']
	 * @return void
	 */
	public static function register_cpt( $label ): void {

		$kebab = str_replace( ' ', '-', strtolower( $label ) );
		$snake = str_replace( ' ', '_', strtolower( $label ) );

		$labels = [
			'name'                     => \esc_html__( $label, Plugin::$kebab ),
			'singular_name'            => \esc_html__( $label, Plugin::$kebab ),
			'add_new'                  => \esc_html__( 'Add new', Plugin::$kebab ),
			'add_new_item'             => \esc_html__( 'Add new item', Plugin::$kebab ),
			'edit_item'                => \esc_html__( 'Edit', Plugin::$kebab ),
			'new_item'                 => \esc_html__( 'New', Plugin::$kebab ),
			'view_item'                => \esc_html__( 'View', Plugin::$kebab ),
			'view_items'               => \esc_html__( 'View', Plugin::$kebab ),
			'search_items'             => \esc_html__( 'Search ' . $label, Plugin::$kebab ),
			'not_found'                => \esc_html__( 'Not Found', Plugin::$kebab ),
			'not_found_in_trash'       => \esc_html__( 'Not found in trash', Plugin::$kebab ),
			'parent_item_colon'        => \esc_html__( 'Parent item', Plugin::$kebab ),
			'all_items'                => \esc_html__( 'All', Plugin::$kebab ),
			'archives'                 => \esc_html__( $label . ' archives', Plugin::$kebab ),
			'attributes'               => \esc_html__( $label . ' attributes', Plugin::$kebab ),
			'insert_into_item'         => \esc_html__( 'Insert to this ' . $label, Plugin::$kebab ),
			'uploaded_to_this_item'    => \esc_html__( 'Uploaded to this ' . $label, Plugin::$kebab ),
			'featured_image'           => \esc_html__( 'Featured image', Plugin::$kebab ),
			'set_featured_image'       => \esc_html__( 'Set featured image', Plugin::$kebab ),
			'remove_featured_image'    => \esc_html__( 'Remove featured image', Plugin::$kebab ),
			'use_featured_image'       => \esc_html__( 'Use featured image', Plugin::$kebab ),
			'menu_name'                => \esc_html__( $label, Plugin::$kebab ),
			'filter_items_list'        => \esc_html__( 'Filter ' . $label . ' list', Plugin::$kebab ),
			'filter_by_date'           => \esc_html__( 'Filter by date', Plugin::$kebab ),
			'items_list_navigation'    => \esc_html__( $label . ' list navigation', Plugin::$kebab ),
			'items_list'               => \esc_html__( $label . ' list', Plugin::$kebab ),
			'item_published'           => \esc_html__( $label . ' published', Plugin::$kebab ),
			'item_published_privately' => \esc_html__( $label . ' published privately', Plugin::$kebab ),
			'item_reverted_to_draft'   => \esc_html__( $label . ' reverted to draft', Plugin::$kebab ),
			'item_scheduled'           => \esc_html__( $label . ' scheduled', Plugin::$kebab ),
			'item_updated'             => \esc_html__( $label . ' updated', Plugin::$kebab ),
		];
		$args   = [
			'label'                 => \esc_html__( $label, Plugin::$kebab ),
			'labels'                => $labels,
			'description'           => '',
			'public'                => true,
			'hierarchical'          => false,
			'exclude_from_search'   => true,
			'publicly_queryable'    => true,
			'show_ui'               => true,
			'show_in_nav_menus'     => true,
			'show_in_admin_bar'     => true,
			'show_in_rest'          => true,
			'can_export'            => true,
			'delete_with_user'      => true,
			'has_archive'           => false,
			'rest_base'             => '',
			'show_in_menu'          => true,
			'menu_position'         => 4,
			'menu_icon'             => 'dashicons-store',
			'capability_type'       => 'post',
			'supports'              => [ 'title', 'editor', 'thumbnail', 'custom-fields', 'author' ],
			'taxonomies'            => [],
			'rest_controller_class' => 'WP_REST_Posts_Controller',
			'rewrite'               => [
				'with_front' => true,
			],
		];

		\register_post_type( $kebab, $args );
	}
	public static function add_metabox( array $args ): void {
		\add_meta_box(
			$args['id'],
			__( $args['label'], Plugin::$kebab ),
			[ __CLASS__, 'render_metabox' ],
			Plugin::$kebab,
			'advanced',
			'default',
			[ 'id' => $args['id'] ]
		);
	}

	/**
	 * Renders the meta box.
	 */
	public static function render_metabox( $post, $metabox ): void {
		echo "<div id='{$metabox[ 'args' ][ 'id' ]}'></div>";
	}

	/**
	 * JSON Parse
	 */
	public static function json_parse( $stringfy, $default = [], $associative = null ) {
		$out_put = '';
		try {
			$out_put = json_decode( str_replace( '\\', '', $stringfy ), $associative ) ?? $default;
		} catch ( \Throwable $th ) {
			$out_put = $default;
		} finally {
			return $out_put;
		}
	}

	public static function get_products_info( int $post_id ): array {
		$shop_meta_string = \get_post_meta( $post_id, Plugin::$snake . '_meta', true ) ?? '[]';

		try {
			$shop_meta = ( json_decode( $shop_meta_string, true ) );
		} catch ( \Throwable $th ) {
			$shop_meta = [];
		}

		if ( ! is_array( $shop_meta ) ) {
			$shop_meta = [];
		}

		function get_product_data( array $meta ): array {
			$meta = (array) $meta ?? [];
			if ( empty( $meta['productId'] ) ) {
				return [];
			}

			$product = \wc_get_product( $meta['productId'] );
			if ( ! $product ) {
				return [];
			}

			$feature_image_id = $product->get_image_id();
			$attachment_ids   = [ $feature_image_id, ...$product->get_gallery_image_ids() ];
			$images           = [];
			foreach ( $attachment_ids as $attachment_id ) {
				$images[] = \wp_get_attachment_url( $attachment_id );
			}
			// format data
			$product_data                         = [];
			$product_data['id']                   = $meta['productId'];
			$product_data['type']                 = $product->get_type();
			$product_data['name']                 = $product->get_name();
			$product_data['description']          = \wpautop( $product->get_description() );
			$product_data['images']               = $images;
			$product_data['stock']                = [
				'manageStock'   => $product->get_manage_stock(),
				'stockQuantity' => $product->get_stock_quantity(),
				'stockStatus'   => $product->get_stock_status(),
			];
			$product_data['is_sold_individually'] = $product->is_sold_individually();
			$product_data['is_in_stock']          = $product->is_in_stock();
			$product_data['is_purchasable']       = $product->is_purchasable();
			$product_data['shortDescription']     = \wpautop( $product->get_short_description() );
			$product_data['sku']                  = $product->get_sku();
			$product_data['total_sales']          = $product->get_total_sales();
			$product_data['backorders']           = $product->get_backorders(); // "yes" | "no" | "notify"

			if ( 'simple' === $product->get_type() ) {
				$product_data['regularPrice']    = $meta['regularPrice'];
				$product_data['salesPrice']      = $meta['salesPrice'];
				$product_data['extraBuyerCount'] = $meta['extraBuyerCount'];
			}
			if ( 'variable' === $product->get_type() && ! empty( $meta['variations'] ) ) {
				$variation_meta                       = $meta['variations']; // Undefined array key "variations"
				$product_data['variations']           = [];
				$product_data['variation_attributes'] = $product->get_variation_attributes();
				$attributes_arr                       = [];
				$attributes                           = $product?->get_attributes(); // get attributes object

				foreach ( $attributes as $key => $attribute ) {
					$option_ids   = $attribute->get_options(); // option_ids
					$slugs        = $attribute->get_slugs(); // option_slugs
					$attr_options = [];

					foreach ( $option_ids as $index => $option_id ) {
						$term           = \get_term_by( 'slug', $slugs[ $index ], $attribute->get_name() );
						$option_name    = $term ? $term->name : $slugs[ $index ];
						$attr_options[] = [
							'value' => urldecode( $slugs[ $index ] ),
							'name'  => urldecode( $option_name ),
						];
					}

					if ( $attribute instanceof \WC_Product_Attribute ) {
						$attributes_arr[] = [
							'name'     => \wc_attribute_label( $attribute->get_name() ),
							'slug'     => $attribute->get_name(),
							'options'  => $attr_options,
							'position' => $attribute->get_position(),
						];
					}

					if ( is_string( $key ) && is_string( $attribute ) ) {
						$attributes_arr[ urldecode( $key ) ] = $attribute;
					}
				}

				$product_data['attributes'] = $attributes_arr;

				foreach ( $product->get_available_variations() as $key => $variation ) {
					$variation_id                       = $variation['variation_id'];
					$variation_product                  = \wc_get_product( $variation_id );
					$theMeta                            = find( $variation_meta, [ 'variationId' => $variation_id ] );
					$product_data['variations'][ $key ] = $variation;
					$product_data['variations'][ $key ]['regularPrice']    = $theMeta['regularPrice'];
					$product_data['variations'][ $key ]['salesPrice']      = $theMeta['salesPrice'];
					$product_data['variations'][ $key ]['stock']           = [
						'manageStock'   => $variation_product->get_manage_stock(),
						'stockQuantity' => $variation_product->get_stock_quantity(),
						'stockStatus'   => $variation_product->get_stock_status(),
					];
					$product_data['variations'][ $key ]['extraBuyerCount'] = $theMeta['extraBuyerCount'];
				}
			}

			return $product_data;
		}

		$products = array_map( __NAMESPACE__ . '\get_product_data', $shop_meta );

		$products_info = [
			'products' => $products,
			'meta'     => $shop_meta,
		];

		return $products_info;
	}
}
