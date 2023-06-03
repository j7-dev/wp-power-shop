<?php

/**
 * Plugin Name: Fast Shop
 * Description: TBD...
 * Author: j7.dev
 * Author URI: https://github.com/j7-dev
 * License: GPLv2
 * Version: 0.0.1
 */

namespace J7\ViteReactWPPlugin;


require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/inc/backend.php';


$instance = new Backend\Bootstrap();
$instance->init();
