<?php

/**
 * Plugin Name: Power Shop | 讓你的商店充滿 Power
 * Description: Power Shop 是一個 WordPress 套件，安裝後，可以讓你的 Woocommerce 商店變成可以提供給多人使用的一頁商店，並且可以讓使用者自訂商品的價格，以及統計每個一頁商店的訂單狀態與銷售額
 * Author: j7.dev
 * Author URI: https://github.com/j7-dev
 * License: GPLv2
 * Version: 2.0.0
 * Requires PHP: 8.1
 */


/**
 * Tags: woocommerce, shop, order
 * Requires at least: 4.6
 * Tested up to: 4.8
 * Stable tag: 4.3
 */

namespace J7\ViteReactWPPlugin\PowerShop;



require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/inc/admin.php';
require_once __DIR__ . '/licenser/index.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__, '.env.production');
$dotenv->safeLoad();

$instance = new Admin\Bootstrap();
$instance->init();
