<?php

/**
 * Plugin Name: Fast Shop 快速商店
 * Description: 快速商店是一個 WordPress 套件，安裝後，可以讓你的 Woocommerce 商店變成可以提供給多人使用的一頁商店，並且可以讓使用者自訂商品的價格，以及統計每個一頁商店的訂單狀態與銷售額
 * Author: j7.dev
 * Author URI: https://github.com/j7-dev
 * License: GPLv2
 * Version: 1.0.3
 */

namespace J7\ViteReactWPPlugin\FastShop;

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/inc/admin.php';

$instance = new Admin\Bootstrap();
$instance->init();
