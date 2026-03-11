<?php
/**
 * Test helper functions
 */

define('WP_CORE_PATH', 'C:\Users\user\Local Sites\wpdev\app\public\wp-load.php');
define('WC_CORE_PATH', 'C:\Users\user\Local Sites\wpdev\app\public\wp-content\plugins\woocommerce\woocommerce.php');


/**
 * Get a random element from an array
 *
 * @param array $arr The input array.
 * @return mixed
 */
function get_random_array( $arr ) {
	return $arr[ array_rand($arr) ];
}

/**
 * Get a random time string
 *
 * @param string $format     The date format.
 * @param string $start_date The start date string.
 * @return string
 */
function get_random_time( $format = 'Y-m-d H:i:s', $start_date = '-3 months' ) {
	$start_date = strtotime($start_date); // 三個月前的時間
	$end_date   = time(); // 現在的時間

	// 隨機生成一個時間戳
	$random_timestamp = mt_rand($start_date, $end_date);

	// 格式化時間戳為指定的日期時間格式
	$random_time = date($format, $random_timestamp);

	return $random_time;
}
