<?php

/**
 * Plugin Name: Fast Shop
 * Description: TBD...
 * Author: j7.dev
 * Author URI: https://github.com/j7-dev
 * License: GPLv2
 * Version: 0.0.1
 */

namespace J7\ViteReactWPPlugin\FastShop;

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/inc/admin.php';

$instance = new Admin\Bootstrap();
$instance->init();

// NOTE for TEST
function testtest(){
	date_default_timezone_set('Asia/Taipei');

	function formatOrders($order)
	{
		$items = $order->get_items();
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

		return [
			'items' => $formatItems,
			'total' => $total,
			'status' => $status,
			'shipping' => $shipping,
		];
	}

	function sumOrder($a, $b){
		return $a + $b->get_total();
	}

	function getSumByDate($date_no){

			$args = [
				'type' => 'shop_order', //shop_order_refund
				'limit' => 10,
				'paged' => 1,
				'meta_key' => 'fast_shop_post_id',
				'meta_value' => 4462,
				'date_created' => strtotime(date("Y-m-d 00:00:00", strtotime('-' . $date_no . ' day'))) . '...' . strtotime(date("Y-m-d 23:59:59")),
				// 'date_paid' => '2021-09-01...2021-09-30',
				// 'date_completed' => '2021-09-01...2021-09-30',
		];

		$the_orders = \wc_get_orders( $args );

		$sum = array_reduce($the_orders, __NAMESPACE__ . '\\sumOrder', 0);
		return $sum;
	}



	$args = [
			'type' => 'shop_order', //shop_order_refund
			'limit' => 10,
			'paged' => 1,
			'meta_key' => 'fast_shop_post_id',
			'meta_value' => 4462,
			'date_created' => '>=' . date("Y-m-d"),
			// 'date_paid' => '2021-09-01...2021-09-30',
			// 'date_completed' => '2021-09-01...2021-09-30',
	];

	$orders = \wc_get_orders( $args );

	$list = array_map( __NAMESPACE__ . '\\formatOrders', $orders);

	$sumToday = getSumByDate(0);
	$sumWeek = getSumByDate(7);

	$args = [
		'type' => 'shop_order', //shop_order_refund
		'limit' => 10,
		'paged' => 1,
		'meta_key' => 'fast_shop_post_id',
		'meta_value' => $post_id,
		'status' => ['wc-processing', 'wc-completed'],
		// 'date_paid' => '2021-09-01...2021-09-30',
		// 'date_completed' => '2021-09-01...2021-09-30',
	];

	$new_args = [
		...$args,
		'limit' => -1,
	];


echo '<pre>';
var_dump($new_args);
echo '</pre>';
}

\add_action( 'wp_head', __NAMESPACE__ . '\\testtest' );
