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
