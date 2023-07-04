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

// TODO Delete
// use function _\find;
// $fast_shop_meta_string = get_post_meta(4462, 'fast_shop_meta', true) ?? '[]';
// $fast_shop_meta = (json_decode($fast_shop_meta_string, true));
// $the_product_meta = find($fast_shop_meta, ['productId' => 13]);
// $the_variations_meta = $the_product_meta['variations'];
// $the_variation_meta = find($the_variations_meta, ['variationId' => 36]) ?? [];

// echo '<pre>';
// var_dump($the_variation_meta);
// echo '</pre>';
// TODO END Delete


$instance = new Admin\Bootstrap();
$instance->init();
