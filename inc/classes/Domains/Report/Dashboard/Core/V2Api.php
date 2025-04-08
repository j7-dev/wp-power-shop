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
	 * @phpstan-ignore-next-line
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

		$compare = new Compare( $args );

		// 取得用戶
		$leaderboards = new Leaderboards();
		$customers    = $leaderboards->get_items(
		[
			'leaderboard' => 'customers',
			'after'       => $after,
			'before'      => $before,
			'per_page'    => $per_page,
		]
		);
		$products     = $leaderboards->get_items(
		[
			'leaderboard' => 'products',
			'after'       => $after,
			'before'      => $before,
			'per_page'    => $per_page,
		]
		);

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

				'products'                        => self::format_leaderboards( $products ), // phpstan-ignore-line
				'customers'                       => self::format_leaderboards( $customers ), // phpstan-ignore-line
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
	 * @return array<string, mixed>
	 */
	private static function get_intervals_in_range( \DateTime $start_date, \DateTime $end_date ) {

		// 檢查 start_date 與 end_date 差距是否超過 48 小時
		$diff       = $start_date->diff( $end_date );
		$diff_hours = $diff->h + ( $diff->days * 24 );
		$show_hour  = $diff_hours <= 48;

		$revenue_api  = RevenueV2Api::instance();
		$revenue_data = $revenue_api->get_reports_revenue_stats(
			[
				'interval' => $show_hour ? 'hour' : 'day',
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
	 * 格式化排行榜
	 *
	 * @param \WP_Error|\WP_REST_Response $leaderboards 排行榜
	 * @return array<array{name: string, count: int, total: float}>
	 * @throws \Exception 如果排行榜為 WP_Error
	 */
	private static function format_leaderboards( $leaderboards ): array {

		if ( \is_wp_error( $leaderboards ) ) {
			throw new \Exception( $leaderboards->get_error_message() );
		}

		$leaderboards = $leaderboards->get_data();
		if ( ! $leaderboards || !is_array( $leaderboards ) ) {
			return [];
		}

		$rows = reset( $leaderboards );
		$rows = $rows['rows'] ?? [];

		if ( ! $rows || !is_array( $rows ) ) {
			return [];
		}

		$formatted_leaderboards = [];
		foreach ( $rows as $row ) {
			$row_dto                  = new Row( $row );
			$formatted_leaderboards[] = $row_dto->to_array();
		}

		return $formatted_leaderboards;
	}
}
