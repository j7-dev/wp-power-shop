<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;

use J7\ViteReactWPPlugin\FastShop\Admin\Bootstrap;

class Order
{

	const GET_ORDERS_ACTION = 'handle_get_orders';



	function __construct()
	{
		foreach ( [
			self::GET_ORDERS_ACTION,
			] as $action) {
				\add_action('wp_ajax_' . $action, [$this,  $action . '_callback']);
				\add_action('wp_ajax_nopriv_' . $action, [$this, $action . '_callback']);
		}
	}

	public function handle_get_orders_callback()
	{
		// Security check
		\check_ajax_referer(Bootstrap::TEXT_DOMAIN, 'nonce');

		if(!isset($_POST['post_id'])) return;
		$post_id = $_POST['post_id'];



		function formatOrders($order)
		{
			$items = $order->get_items() ?? [];
			$formatItems = [];
			$i = 0;
			foreach ($items as $item) {
				$formatItems[$i]['item_id'] = $item->get_id();
				$formatItems[$i]['name'] = $item->get_name();
				$formatItems[$i]['quantity'] = $item->get_quantity();
				$formatItems[$i]['line_total'] = $order->get_item_meta($item->get_id(), '_line_total', true);
				$formatItems[$i]['total'] = $item->get_total();
				$formatItems[$i]['product_id'] = $item->get_product_id();
				$formatItems[$i]['variation_id'] = $item->get_variation_id();
				$i++;
			}
			$total = $order->get_total();
			$status = $order->get_status();
			$shipping = $order->get_shipping_total();
			$shipping_method = $order->get_shipping_method();

			return [
				'items' => $formatItems,
				'total' => $total,
				'status' => $status,
				'shipping' => $shipping,
				'shipping_method' => $shipping_method,
				'order_id' => $order->get_id(),
				'key' => $order->get_id(),
			];
		}

		function sumOrder($a, $b){
			return $a + $b->get_total();
		}

		function getSumByDate($date_no){
				date_default_timezone_set('Asia/Taipei');
				$args = [
					'type' => 'shop_order', //shop_order_refund
					'limit' => 10,
					'paged' => 1,
					'meta_key' => 'fast_shop_post_id',
					'meta_value' => 4462,
					'date_created' => date("Y-m-d", strtotime('-' . $date_no . ' day')) . '...' . date("Y-m-d"),
					// 'date_paid' => '2021-09-01...2021-09-30',
					// 'date_completed' => '2021-09-01...2021-09-30',
			];

			$the_orders = \wc_get_orders( $args );

			$sum = array_reduce($the_orders, __NAMESPACE__ . '\\sumOrder', 0);
			return $sum;
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
		$args = [
			'type' => 'shop_order', //shop_order_refund
			'limit' => 10,
			'paged' => 1,
			'meta_key' => 'fast_shop_post_id',
			'meta_value' => $post_id,
			// 'status' => ['wc-processing', 'wc-completed'],
		];
		$orders = \wc_get_orders( $args );

		$sumToday = getSumByDate(0);
		$sumWeek = getSumByDate(7);

		$list = array_map( __NAMESPACE__ . '\\formatOrders', $orders);

		$return = array(
			'message'  => 'success',
			'data'       => [
				'list' => $list,
				'info' => [
					'sumToday' => $sumToday,
					'sumWeek' => $sumWeek,
				]
			]
		);

		\wp_send_json($return);

		\wp_die();
	}


}
