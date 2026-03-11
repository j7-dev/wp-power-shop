<?php
/**
 * Api
 */

declare(strict_types=1);

namespace J7\PowerShopV2;

use J7\PowerShop\Plugin;
/**
 * Api
 */
final class Api {
	use \J7\WpUtils\Traits\SingletonTrait;

	const POSTMETA_API_ENDPOINT       = 'postmeta';
	const AJAX_NONCE_ENDPOINT         = 'ajaxnonce';
	const PURGE_KINSTA_CACHE_ENDPOINT = 'purge_kinsta_cache';
	const PRODUCT_CATEGORY_ENDPOINT   = 'product_categories';

	/**
	 * Constructor
	 */
	public function __construct() {
		foreach ( [ self::POSTMETA_API_ENDPOINT, self::AJAX_NONCE_ENDPOINT, self::PURGE_KINSTA_CACHE_ENDPOINT, self::PRODUCT_CATEGORY_ENDPOINT ] as $action ) {
			\add_action( 'rest_api_init', [ $this, "register_{$action}_api" ] );
		}
	}

	/**
	 * Product categories callback
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return \WP_REST_Response
	 */
	public function product_categories_callback( $request ) {
		$params = $request->get_params();

		if (\class_exists('J7\WpUtils\Classes\WP')) {
			$params = \J7\WpUtils\Classes\WP::sanitize_text_field_deep( $params, false );
		}

		$default_args = [
			'taxonomy'   => 'product_cat',
			'hide_empty' => false,
		];

		$args = \wp_parse_args(
			$params,
			$default_args,
		);

		$product_categories = \get_terms($args);

		$formatted_product_categories = \array_map(
			function ( $product_category ) {
				return [
					'id'   => $product_category->term_id,
					'name' => $product_category->name,
				];
			},
			$product_categories
		);

		return \rest_ensure_response( $formatted_product_categories );
	}

	/**
	 * Register product categories API
	 *
	 * @return void
	 */
	public function register_product_categories_api() {
		$endpoint = self::PRODUCT_CATEGORY_ENDPOINT;
		\register_rest_route(
			'power-shop',
			$endpoint,
			[
				'methods'             => 'GET',
				'callback'            => [ $this, "{$endpoint}_callback" ],
				'permission_callback' => '__return_true',
			]
		);
	}

	/**
	 * Postmeta callback
	 *
	 * @param \WP_REST_Request $request The request object.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function postmeta_callback( $request ) {
		$post_id = $request['id'];

		// 檢查文章是否存在
		if ( \get_post_status( $post_id ) ) {
			$post_meta           = \get_post_meta( $post_id );
			$formatted_post_meta = [];
			foreach ( $post_meta as $key => $value ) {
				$formatted_post_meta[ $key ] = $value[0];
			}

			// 在此處理 post_meta 資訊，你可以根據需要進行資料處理

			return \rest_ensure_response( $formatted_post_meta );
		} else {
			return new \WP_Error( 'post_not_found', '文章不存在', [ 'status' => 404 ] );
		}
	}

	/**
	 * Register postmeta API
	 *
	 * @return void
	 */
	public function register_postmeta_api() {
		$endpoint = self::POSTMETA_API_ENDPOINT;
		\register_rest_route(
			'wrp',
			"{$endpoint}/(?P<id>\d+)",
			[
				'methods'             => 'GET',
				'callback'            => [ $this, "{$endpoint}_callback" ],
				'permission_callback' => '__return_true',
			]
		);
	}

	/**
	 * Ajax nonce callback
	 *
	 * @return \WP_REST_Response
	 */
	public function ajaxnonce_callback() {
		$ajaxNonce = \wp_create_nonce( Plugin::$kebab );

		return \rest_ensure_response( $ajaxNonce );
	}

	/**
	 * Register ajax nonce API
	 *
	 * @return void
	 */
	public function register_ajaxnonce_api() {
		$endpoint = self::AJAX_NONCE_ENDPOINT;
		\register_rest_route(
			'wrp',
			"{$endpoint}",
			[
				'methods'             => 'GET',
				'callback'            => [ $this, "{$endpoint}_callback" ],
				'permission_callback' => '__return_true',
			]
		);
	}

	/**
	 * Purge Kinsta cache callback
	 *
	 * @return \WP_REST_Response
	 */
	public function purge_kinsta_cache_callback() {
		if ( class_exists( 'Kinsta\Cache_Purge' ) ) {
			try {
				$response = wp_remote_get(
					'https://localhost/kinsta-clear-cache-all',
					[
						'sslverify' => false,
						'timeout'   => 5,
					]
				);
				return \rest_ensure_response( $response );
			} catch ( \Throwable $th ) {
				throw $th;
			}
		}
		return \rest_ensure_response( 'not find kinsta mu-plugin' );
	}

	/**
	 * Register purge Kinsta cache API
	 *
	 * @return void
	 */
	public function register_purge_kinsta_cache_api() {
		$endpoint = self::PURGE_KINSTA_CACHE_ENDPOINT;
		\register_rest_route(
			'wrp',
			"{$endpoint}",
			[
				'methods'             => 'GET',
				'callback'            => [ $this, "{$endpoint}_callback" ],
				'permission_callback' => '__return_true',
			]
		);
	}
}
