<?php

declare(strict_types=1);

namespace J7\PowerShop\Domains\Report\Dashboard\Core;

use J7\WpUtils\Classes\ApiBase;
use J7\WpUtils\Classes\WP;
use Automattic\WooCommerce\Admin\API\Leaderboards;
use J7\Powerhouse\Domains;
use J7\Powerhouse\Utils\Compare;
use J7\Powerhouse\Domains\Report\Revenue\Core\V2Api as RevenueV2Api;
use J7\PowerShop\Domains\Report\LeaderBoards\DTO\Row;


/**
 * Revenue Api
 */
final class V2Api extends ApiBase {
	use \J7\WpUtils\Traits\SingletonTrait;

	/**
	 * Namespace
	 *
	 * @var string
	 */
	protected $namespace = 'power-shop';

	/**
	 * APIs
	 *
	 * @var array{endpoint: string, method: string, permission_callback: ?callable}[]
	 * - endpoint: string
	 * - method: 'get' | 'post' | 'patch' | 'delete'
	 * - permission_callback : callable
	 */
	protected $apis = [
		[
			'endpoint'            => 'reports/dashboard/stats',
			'method'              => 'get',
			'permission_callback' => null,
		],
	];

	/**
	 * Get dashboard stats
	 *
	 * @param \WP_REST_Request $request Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_reports_dashboard_stats_callback( $request ) { // phpcs:ignore
		$params = $request->get_query_params();
		$params = WP::sanitize_text_field_deep( $params, false );

		// 取得今日時間的 00:00:00 和 23:59:59
		$after = new \DateTime('now', new \DateTimeZone(\wp_timezone_string()));
		$after->setTime(0, 0, 0); // 設置為當天 00:00:00
		$before = new \DateTime('now', new \DateTimeZone(\wp_timezone_string()));
		$before->setTime(23, 59, 59); // 設置為當天 23:59:59

		$default_args = [
			'after'           => $after->format('Y-m-d\TH:i:s'),
			'before'          => $before->format('Y-m-d\TH:i:s'),
			'per_page'        => 5,
			'persisted_query' => (object) [],
			'compare_type'    => 'day', // 比較前N天
			'compare_value'   => 1, // 比較前一天
			'_locale'         => 'user',
		];

		// 合併參數
		$args = \wp_parse_args(
		$params,
		$default_args,
		);

		// 解構
		[
		'after' => $after,
		'before' => $before,
		'per_page' => $per_page,
		'compare_type' => $compare_type,
		'compare_value' => $compare_value,
		] = $args;

		$compare_args = [
			'after'         => (string) $after,
			'before'        => (string) $before,
			'compare_type'  => (string) $compare_type,
			'compare_value' => (int) $compare_value,
		];
		$compare      = new Compare( $compare_args );

		// 取得用戶
		$leaderboards   = new Leaderboards();
		$per_page_int   = (int) $per_page;
		$after_str      = (string) $after;
		$before_str     = (string) $before;
		$all_boards     = $leaderboards->get_leaderboards( $per_page_int, $after_str, $before_str, '' );
		$customers_data = [];
		$products_data  = [];

		foreach ( $all_boards as $board ) {
			if ( ! is_array( $board ) ) {
				continue;
			}
			$board_id = $board['id'] ?? '';
			if ( $board_id === 'customers' ) {
				$customers_data = $board['rows'] ?? [];
			}
			if ( $board_id === 'products' ) {
				$products_data = $board['rows'] ?? [];
			}
		}

		return new \WP_REST_Response(
		[
			'code'    => 'get_reports_dashboard_stats_callback',
			'message' => 'success',
			'data'    => [
				// 營收
				'total_sales'                     => Domains\Order\Utils\CRUD::get_order_total_in_range( $compare->after, $compare->before ),

				// 前 N 時間區間營收
				'total_sales_compared'            => Domains\Order\Utils\CRUD::get_order_total_in_range( $compare->after_compared, $compare->before_compared ),

				// 新註冊用戶
				'new_registration'                => Domains\User\Utils\CRUD::get_new_registration_in_range( $compare->after, $compare->before ),

				// 前 N 時間區間新增用戶
				'new_registration_compared'       => Domains\User\Utils\CRUD::get_new_registration_in_range( $compare->after_compared, $compare->before_compared ),

				// 訂單未出貨 = 狀態 processing
				'orders_count_unshipped'          => Domains\Order\Utils\CRUD::get_order_count_in_range( $compare->after, $compare->before, [ 'processing' ] ),

				// 前 N 時間區間訂單未出貨
				'orders_count_unshipped_compared' => Domains\Order\Utils\CRUD::get_order_count_in_range( $compare->after_compared, $compare->before_compared, [ 'processing' ] ),

				// 訂單未付款 = 狀態 pending, on-hold
				'orders_count_unpaid'             => Domains\Order\Utils\CRUD::get_order_count_in_range( $compare->after, $compare->before, [ 'pending', 'on-hold' ] ),

				// 前 N 時間區間訂單未付款
				'orders_count_unpaid_compared'    => Domains\Order\Utils\CRUD::get_order_count_in_range( $compare->after_compared, $compare->before_compared, [ 'pending', 'on-hold' ] ),

				'products'                        => self::format_leaderboard_rows( $products_data ),
				'customers'                       => self::format_leaderboard_rows( $customers_data ),
				'intervals'                       => self::get_intervals_in_range( $compare->after, $compare->before ),
			],
		]
		);
	}

	/**
	 * 取得時間範圍內的訂單，並且格式化
	 *
	 * @param \DateTime $start_date 開始日期
	 * @param \DateTime $end_date 結束日期
	 * @return list<array<string, mixed>>
	 */
	private static function get_intervals_in_range( \DateTime $start_date, \DateTime $end_date ) {

		// 檢查 start_date 與 end_date 差距是否超過 48 小時
		$diff      = $start_date->diff( $end_date );
		$diff_days = $diff->days ?: 1;

		// 依照不同時間差調整 interval
		$interval = 'hour';

		if ($diff_days >= 3 && $diff_days < 21) {
			$interval = 'day';
		}

		if ($diff_days >= 21 && $diff_days < 93) {
			$interval = 'week';
		}

		if ($diff_days >= 93) {
			$interval = 'month';
		}

		$revenue_api  = RevenueV2Api::instance();
		$revenue_data = $revenue_api->get_reports_revenue_stats(
			[
				'interval' => $interval,
				'after'    => $start_date->format('Y-m-d\TH:i:s'),
				'before'   => $end_date->format('Y-m-d\TH:i:s'),
			]
			);

		$intervals = $revenue_data->intervals;

		$intervals_data = [];
		foreach ( $intervals as $interval ) {
			// 物件轉換為 array
			$subtotals_array                   = (array) $interval['subtotals'];
			$subtotals_array['interval']       = $interval['interval'];
			$subtotals_array['date_start']     = $interval['date_start'];
			$subtotals_array['date_start_gmt'] = $interval['date_start_gmt'];
			$subtotals_array['date_end']       = $interval['date_end'];
			$subtotals_array['date_end_gmt']   = $interval['date_end_gmt'];
			$intervals_data[]                  = $subtotals_array;
		}

		return $intervals_data;
	}

	/**
	 * 格式化排行榜的 rows
	 *
	 * @param mixed $rows 排行榜 rows 資料
	 * @return array<array{name: string, count: int, total: float}>
	 */
	private static function format_leaderboard_rows( mixed $rows ): array {

		if ( ! is_array( $rows ) ) {
			return [];
		}

		$formatted_leaderboards = [];
		foreach ( $rows as $row ) {
			if ( ! is_array( $row ) ) {
				continue;
			}
			/** @var array{0: array{display: string, value: string, format?: string}, 1: array{display: string, value: int, format?: string}, 2: array{display: string, value: float, format?: string}} $row */
			$row_dto                  = new Row( $row );
			$formatted_leaderboards[] = $row_dto->to_array();
		}

		return $formatted_leaderboards;
	}
}
