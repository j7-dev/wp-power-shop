<?php

declare(strict_types=1);

namespace J7\PowerShopV2;

use J7\PowerShop\Plugin;

/**
 * Class Ajax
 */
final class Ajax {
	use \J7\WpUtils\Traits\SingletonTrait;


	const GET_POST_META_ACTION    = 'ps_handle_get_post_meta';
	const UPDATE_POST_META_ACTION = 'handle_update_post_meta';

	/**
	 * Constructor
	 *
	 * Endpoints read/write Power Shop post meta. Both require an authenticated
	 * editor session, so we deliberately do NOT register `wp_ajax_nopriv_*`
	 * counterparts. Allowing anonymous access here was the historical cause of
	 * `power_shop_meta` being wiped to `[]` by random POSTs from bots.
	 */
	public function __construct() {
		foreach ( [ self::GET_POST_META_ACTION, self::UPDATE_POST_META_ACTION ] as $action) {
			\add_action('wp_ajax_' . $action, [ $this, $action . '_callback' ]);
		}
	}

	/**
	 * Meta keys this endpoint is allowed to read or write.
	 *
	 * Without an allowlist a caller could pull/push arbitrary post meta via
	 * this generic endpoint, leaking private keys (e.g. `_edit_lock`) or
	 * stomping on unrelated meta.
	 *
	 * @return string[]
	 */
	private function allowed_meta_keys(): array {
		return [
			Plugin::$snake . '_meta',
			Plugin::$snake . '_settings',
		];
	}

	/**
	 * Handle get post meta callback
	 *
	 * @return void
	 */
	public function ps_handle_get_post_meta_callback() {
		$post_id  = \absint( \wp_unslash( $_POST['post_id'] ?? 0 ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		$meta_key = \sanitize_text_field( \wp_unslash( $_POST['meta_key'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing

		if ( empty( $post_id ) ) {
			\wp_send_json( [ 'message' => 'error', 'data' => [ 'reason' => 'missing post_id' ] ] );
			return;
		}

		if ( ! \current_user_can( 'edit_post', $post_id ) ) {
			\wp_send_json( [ 'message' => 'error', 'data' => [ 'reason' => 'permission denied' ] ] );
			return;
		}

		// When a meta_key is supplied it must be one we explicitly own.
		if ( ! empty( $meta_key ) && ! \in_array( $meta_key, $this->allowed_meta_keys(), true ) ) {
			\wp_send_json( [ 'message' => 'error', 'data' => [ 'reason' => 'meta_key not allowed: ' . $meta_key ] ] );
			return;
		}

		$post_meta = empty( $meta_key ) ? \get_post_meta( $post_id ) : \get_post_meta( $post_id, $meta_key, true );

		\wp_send_json(
			[
				'message' => 'success',
				'data'    => [
					'post_meta' => $post_meta,
				],
			]
		);
	}

	/**
	 * Handle update post meta callback
	 *
	 * Defenses, in order:
	 *  1. Login + capability check (nopriv removed in __construct).
	 *  2. Meta-key allowlist — only Power Shop's own meta may be written.
	 *  3. JSON value passes through unsanitised: `sanitize_text_field` on a
	 *     JSON blob silently mangles whitespace and `<` characters.
	 *  4. Anti-wipe guard: refuse to overwrite a non-empty product list with
	 *     an empty one. Pass `force=1` to override (e.g. real "clear all").
	 *  5. History snapshot: every successful overwrite of a non-empty list
	 *     stashes the previous value into `power_shop_meta_history` so we
	 *     can recover from accidents (last 5 retained).
	 *
	 * @return void
	 */
	public function handle_update_post_meta_callback() {
		$post_id    = \absint( \wp_unslash( $_POST['post_id'] ?? 0 ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		$meta_key   = \sanitize_text_field( \wp_unslash( $_POST['meta_key'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
		$meta_value = \wp_unslash( $_POST['meta_value'] ?? '' ); // phpcs:ignore WordPress.Security.NonceVerification.Missing -- JSON string; sanitize_text_field would mangle it.

		if ( empty( $post_id ) || empty( $meta_key ) ) {
			\wp_send_json( [ 'message' => 'error', 'data' => [ 'reason' => 'missing post_id or meta_key' ] ] );
			return;
		}

		if ( ! \current_user_can( 'edit_post', $post_id ) ) {
			\wp_send_json( [ 'message' => 'error', 'data' => [ 'reason' => 'permission denied' ] ] );
			return;
		}

		if ( ! \in_array( $meta_key, $this->allowed_meta_keys(), true ) ) {
			\wp_send_json( [ 'message' => 'error', 'data' => [ 'reason' => 'meta_key not allowed: ' . $meta_key ] ] );
			return;
		}

		$products_meta_key = Plugin::$snake . '_meta';
		if ( $products_meta_key === $meta_key ) {
			$previous_raw = (string) \get_post_meta( $post_id, $meta_key, true );
			$previous     = \json_decode( $previous_raw, true );
			$new          = \json_decode( (string) $meta_value, true );

			$prev_count = \is_array( $previous ) ? \count( $previous ) : 0;
			$new_count  = \is_array( $new ) ? \count( $new ) : 0;

			$force = ! empty( $_POST['force'] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing

			if ( $prev_count > 0 && 0 === $new_count && ! $force ) {
				\wp_send_json(
					[
						'message' => 'refused',
						'data'    => [
							'reason'         => sprintf(
								'Refused to overwrite %d products with an empty list. Resend with force=1 to override.',
								$prev_count
							),
							'previous_count' => $prev_count,
						],
					]
				);
				return;
			}

			if ( $prev_count > 0 ) {
				$history_key = Plugin::$snake . '_meta_history';
				$history     = \get_post_meta( $post_id, $history_key, true );
				$history     = \is_array( $history ) ? $history : [];
				$history[]   = [
					'saved_at' => \current_time( 'mysql' ),
					'user_id'  => \get_current_user_id(),
					'value'    => $previous_raw,
				];
				$history     = \array_slice( $history, -5 );
				\update_post_meta( $post_id, $history_key, $history );
			}
		}

		$update_result = \update_post_meta( $post_id, $meta_key, $meta_value );

		\wp_send_json(
			[
				'message' => 'success',
				'data'    => [
					'update_result' => $update_result,
				],
			]
		);
	}
}
