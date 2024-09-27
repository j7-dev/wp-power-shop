<?php

declare (strict_types = 1);

namespace J7\PowerShop;

use J7\PowerShop\Functions;

final class Order {
	use \J7\WpUtils\Traits\SingletonTrait;


	const GET_ORDERS_ACTION = 'handle_get_orders';

	function __construct() {
		foreach ([
			self::GET_ORDERS_ACTION,
		] as $action) {
			\add_action('wp_ajax_' . $action, [ $this, $action . '_callback' ]);
			\add_action('wp_ajax_nopriv_' . $action, [ $this, $action . '_callback' ]);
		}

		\add_filter('manage_edit-shop_order_columns', [ $this, 'custom_shop_order_column' ], 20);
		\add_action('manage_shop_order_posts_custom_column', [ $this, 'custom_orders_list_column_content' ], 20, 2);
	}

	public function handle_get_orders_callback() {

		// Security check
		\check_ajax_referer(Plugin::$kebab, 'nonce');

		$post_id = \sanitize_text_field($_POST['post_id'] ?? 0);

		if (empty($post_id)) {
			return;
		}

		$paged           = \sanitize_text_field($_POST['paged'] ?? 1);
		$limit           = \sanitize_text_field($_POST['limit'] ?? 10);
		$status_stringfy = \sanitize_text_field($_POST['status'] ?? '[]');

		$status = Functions::json_parse($status_stringfy, []);
		$email  = \sanitize_text_field($_POST['email'] ?? '');

		$date_created = \sanitize_text_field($_POST['date_created'] ?? '');

		$is_download = \sanitize_text_field($_POST['is_download'] ?? 0);

		$args = [
			'type'         => 'shop_order', // 'shop_order' | 'shop_order_refund'
			'limit'        => $limit,
			'paged'        => $paged,
			'meta_key'     => Plugin::$snake . '_post_id',
			'meta_value'   => $post_id,
			'status'       => $status,
			'paginate'     => true,
			'customer'     => $email,
			'date_created' => $date_created,
			// 'date_paid' => '2021-09-01...2021-09-30',
			// 'date_completed' => '2021-09-01...2021-09-30',
		];

		if (count($status) === 0) {
			unset($args['status']);
		}

		if (empty($email)) {
			unset($args['customer']);
		}
		if (empty($date_created)) {
			unset($args['date_created']);
		}

		function format_orders( $order ) {
			$items       = $order->get_items() ?? [];
			$formatItems = [];
			$i           = 0;
			foreach ($items as $item) {
				$formatItems[ $i ]['item_id']      = $item->get_id();
				$formatItems[ $i ]['name']         = $item->get_name();
				$formatItems[ $i ]['quantity']     = $item->get_quantity();
				$formatItems[ $i ]['line_total']   = $order->get_item_meta($item->get_id(), '_line_total', true);
				$formatItems[ $i ]['total']        = $item->get_total();
				$formatItems[ $i ]['product_id']   = $item->get_product_id();
				$formatItems[ $i ]['variation_id'] = $item->get_variation_id();
				++$i;
			}
			$total           = $order->get_total();
			$status          = $order->get_status();
			$shipping        = $order->get_shipping_total();
			$shipping_method = $order->get_shipping_method();
			$customer        = $order->get_user();
			if ($customer) {
				$customer_id           = $customer->ID;
				$customer_display_name = $customer->display_name;
			} else {
				$customer_id           = 0;
				$customer_display_name = $order->get_billing_email();
			}

			return [
				'items'           => $formatItems,
				'total'           => $total,
				'status'          => $status,
				'shipping'        => $shipping,
				'shipping_method' => $shipping_method,
				'order_id'        => $order->get_id(),
				'customer'        => [
					'id'           => $customer_id,
					'display_name' => $customer_display_name,
				],
				'key'             => $order->get_id(),
			];
		}

		function sum_order( $a, $b ) {
			return $a + $b->get_total();
		}

		function get_sum_by_date( $date_no, $args ) {
			// date_default_timezone_set('Asia/Taipei');
			unset($args['paginate']);

			if ($date_no === -1) {

				$sum_args = array_merge($args, [ 'limit' => -1 ]);
			} else {
				$sum_args = array_merge($args, [ 'date_created' => date('Y-m-d', strtotime('-' . $date_no . ' day')) . '...' . date('Y-m-d') ]);
			}

			$the_orders = \wc_get_orders($sum_args);

			$sum         = array_reduce($the_orders, __NAMESPACE__ . '\\sum_order', 0);
			$order_count = count($the_orders);
			return [
				'sum'       => $sum,
				'order_qty' => $order_count,
			];
		}

		/**
		 * NOTE order status
		 * wc-pending
		 * wc-processing
		 * wc-wmp-in-transit
		 * wc-wmp-shipped
		 * wc-on-hold
		 * wc-completed
		 * wc-cancelled
		 * wc-refunded
		 * wc-failed
		 * wc-checkout-draft
		 * wc-ry-at-cvs
		 * wc-ry-out-cvs
		 */

		$results = \wc_get_orders($args);
		$orders  = $results->orders ?? [];
		$list    = array_map(__NAMESPACE__ . '\\format_orders', $orders);

		// TODO 判斷是否為下載EXCEL需求
		// if (!empty($is_download)) {

		// $return = [
		// 'message'  => 'success download',
		// 'data'       => []
		// ];

		// \wp_send_json($return);

		// \wp_die();
		// }

		$total         = $results->total ?? 0;
		$max_num_pages = $results->max_num_pages ?? 1;

		$sumTotal       = get_sum_by_date(-1, $args);
		$sumToday       = get_sum_by_date(0, $args);
		$sumWeek        = get_sum_by_date(7, $args);
		$order_statuses = \wc_get_order_statuses();
		$orderStatuses  = [];
		$i              = 0;
		foreach ($order_statuses as $key => $value) {
			$orderStatuses[ $i ]['value'] = $key;
			++$i;
		}

		$return = [
			'message' => 'success',
			'data'    => [
				'list' => $list,
				'info' => [
					'sumTotal'      => $sumTotal,
					'sumToday'      => $sumToday,
					'sumWeek'       => $sumWeek,
					'orderStatuses' => $orderStatuses,
					'total'         => $total,
					'maxNumPages'   => $max_num_pages,
				],
				'args' => $args,
			],
		];

		\wp_send_json($return);

		\wp_die();
	}

	public function custom_shop_order_column( $columns ) {
		$reordered_columns = [];

		// Inserting columns to a specific location
		foreach ($columns as $key => $column) {
			$reordered_columns[ $key ] = $column;
			if ($key == 'order_number') {
				// Inserting after "Status" column
				$reordered_columns[ Plugin::$snake . '_post_id' ] = \__('Linked Power Shop', Plugin::$kebab);
			}
		}
		return $reordered_columns;
	}

	public function custom_orders_list_column_content( $column, $post_id ) {
		switch ($column) {
			case Plugin::$snake . '_post_id':
				$shop_id = \get_post_meta($post_id, Plugin::$snake . '_post_id', true);
				if (!empty($shop_id)) {
					$title = \get_the_title($shop_id);
					$url   = \add_query_arg(
						[
							'post'   => $shop_id,
							'action' => 'edit',
						],
						\admin_url('post.php')
					);
					echo '<a href="' . $url . '" target="_blank">' . $title . '</a>';
				}

				break;
		}
	}
}
