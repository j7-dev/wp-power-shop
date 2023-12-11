<?php
use J7\WpReactPlugin\PowerShop\Inc\Bootstrap;

[
    'product'           => $product,
    'meta'              => $meta,
    'default_image_src' => $default_image_src,
    'is_shop_closed'    => $is_shop_closed,
 ] = $args;

$img_id  = $product->get_image_id();
$img_src = \wp_get_attachment_image_src($img_id, [ 450, 450 ]) ?: [ $default_image_src ];
$name    = $product->get_name();

[
    'productId'    => $product_id,
    'regularPrice' => $regular_price,
    'salesPrice'   => $sales_price,
 ] = $meta;

if (empty($regular_price) && empty($sales_price)) {
    // 商品類型轉換時，才會發生這種情況
    $regular_price = $product->get_regular_price();
    $sales_price   = $product->get_sale_price();
}

if (strpos($_SERVER[ 'REQUEST_URI' ], Bootstrap::KEBAB) === false) {
    // 如果不包含 Bootstrap::KEBAB 字串，有可能在其他編輯器預覽，則不加入 ps-not-ready class
    $class = '';
} else {
    // 如果包含 Bootstrap::KEBAB 字串，則加入 ps-not-ready class
    $class = 'ps-not-ready';
}

$product_status = $product->get_status();

if ($product_status === 'publish'):
?>
	<div data-ps-product-id="<?=$product_id?>" class="group relative pb-12 <?=$is_shop_closed ? 'pointer-events-none' : ''?> <?=$class?>">
		<div class="w-full aspect-square overflow-hidden">
			<img src="<?=$img_src[ 0 ]?>" class="group-hover:scale-125 duration-300 w-full aspect-square object-cover" alt="<?=$name?>">
		</div>
		<div class="mt-2">
			<?=$name?>
		</div>
		<div>
			<?php if (!empty($sales_price)): ?>
				<p class="mb-0 mt-1"><del>NT$ <?=$regular_price?></del></p>
				<p class="mb-0 mt-1 text-red-500">NT$ <?=$sales_price?></p>
			<?php else: ?>
				<p class="mb-0 mt-1">NT$ <?=$regular_price?></p>
			<?php endif;?>

		</div>

		<button type="button" <?=$is_shop_closed ? 'disabled' : ''?> class="ps-btn ps-btn-primary w-full absolute bottom-0"><span><?php echo $is_shop_closed ? '商店已關閉' : '加入購物車' ?></span></button>
	</div>
<?php endif;?>