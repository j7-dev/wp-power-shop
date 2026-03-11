<?php
require_once '../index.php';
require_once WP_CORE_PATH;
require_once WC_CORE_PATH;

define('ORDER_QTY', 30);
define('SHOP_POST_ID', '4929');
define('CUSTOMER_ID', 1);




$wc_order_status = [ 'wc-pending', 'wc-processing', 'wc-on-hold', 'wc-completed', 'wc-cancelled', 'wc-refunded', 'wc-failed', 'wc-wmp-in-transit', 'wc-wmp-shipped', 'wc-checkout-draft', 'wc-ry-at-cvs', 'wc-ry-out-cvs' ];

// 检查 WooCommerce 是否已激活
if (!function_exists('WC')) {
	echo 'WooCommerce 未激活';
	exit;
}


try {
	// 計時
	$start_time = microtime(true);

	// get all woocommerce product ids
	$product_ids = wc_get_products(
		[
			'limit'  => -1,
			'status' => 'publish',
			'return' => 'ids',
		]
		);

	$output_order_ids = '';

	for ($i = 0; $i < ORDER_QTY; $i++) {
		$item_qty = mt_rand(1, 4);

		$wc_order = wc_create_order();
		for ($j = 0; $j < $item_qty; $j++) {
			$wc_order->add_product(wc_get_product(get_random_array($product_ids)), mt_rand(1, 10));
		}
		$wc_order->set_customer_id(CUSTOMER_ID);
		$wc_order->calculate_totals();

		// 設定訂單狀態
		$wc_order->set_status(get_random_array($wc_order_status));

		// 更新建立日期
		$wc_order->set_date_created(new WC_DateTime(get_random_time()));

		// 更新 meta
		$wc_order->update_meta_data('power_shop_post_id', SHOP_POST_ID);

		// 保存訂單變更
		$wc_order->save();

		$output_order_ids .= $wc_order->get_id() . ', ';
	}


	// 計時結束
	$end_time       = microtime(true);
	$execution_time = $end_time - $start_time;

	$output  = "\n\n創建 " . ORDER_QTY . ' 個訂單成功! 耗時 ' . $execution_time . " 秒\n\n";
	$output .= '訂單編號: ' . $output_order_ids . "\n\n";
	$output  = str_replace("\n", '' . PHP_EOL, $output);

	echo $output;
} catch (\Throwable $th) {
	echo '創建訂單失敗!';
	throw $th;
}
