<?php
require_once '../index.php';
require_once WP_CORE_PATH;
require_once WC_CORE_PATH;

define('ORDER_QTY', 30);

$order_status = ['wc-pending', 'wc-processing', 'wc-on-hold', 'wc-completed', 'wc-cancelled', 'wc-refunded', 'wc-failed', 'wc-wmp-in-transit', 'wc-wmp-shipped', 'wc-checkout-draft', 'wc-ry-at-cvs', 'wc-ry-out-cvs'];

// 检查 WooCommerce 是否已激活
if (!function_exists('WC')) {
	echo "WooCommerce 未激活";
	exit;
}

// pick a  integer between 1 and 100

try {
	// 計時
	$start_time = microtime(true);

	// get all woocommerce product ids
	$product_ids = wc_get_products([
		'limit' => -1,
		'status' => 'publish',
		'return' => 'ids',
	]);

	$order_ids = '';

	for ($i = 0; $i < ORDER_QTY; $i++) {
		$item_qty = mt_rand(1, 4);

		$order = wc_create_order();
		for ($j = 0; $j < $item_qty; $j++) {
			$order->add_product(wc_get_product(getRandomArray($product_ids)), mt_rand(1, 10));
		}
		$order->set_customer_id(1);
		$order->calculate_totals();

		// 設定訂單狀態
		$order->set_status(getRandomArray($order_status));

		// 更新建立日期
		$order->set_date_created(new WC_DateTime(getRandomTime()));

		// 保存訂單變更
		$order->save();

		$order_ids .= $order->get_id() . ', ';
	}


	//計時結束
	$end_time = microtime(true);
	$execution_time = $end_time - $start_time;

	$output = "\n\n創建 " . ORDER_QTY . " 個訂單成功! 耗時 " . $execution_time .  " 秒\n\n";
	$output .= "訂單編號: " . $order_ids . "\n\n";
	$output = str_replace("\n", "" . PHP_EOL, $output);

	echo $output;
} catch (\Throwable $th) {
	echo '創建訂單失敗!';
	throw $th;
}
