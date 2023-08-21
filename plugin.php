<?php

/**
 * Plugin Name:       Power Shop | 讓你的商店充滿 Power
 * Plugin URI:        https://luke.cafe/plugins/power-shop
 * Description:       Power Shop 是一個 WordPress 套件，安裝後，可以讓你的 Woocommerce 商店變成可以提供給多人使用的一頁商店，並且可以讓使用者自訂商品的價格，以及統計每個一頁商店的訂單狀態與銷售額
 * Version:           2.1.1
 * Requires at least: 5.7
 * Requires PHP:      7.3
 * Author:            j7.dev
 * Author URI:        https://github.com/j7-dev
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       power-shop
 * Domain Path:       /languages
 */


namespace J7\ViteReactWPPlugin\PowerShop;

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__, '.env.production');
$dotenv->safeLoad();

require_once __DIR__ . '/licenser/index.php';
require_once __DIR__ . '/inc/admin.php';


$instance = new Admin\Bootstrap();
$instance->init();



// Tags: woocommerce, shop, order
// Requires at least: 4.6
// Tested up to: 4.8
// Stable tag: 4.3
