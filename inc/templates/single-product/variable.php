<?php
use J7\PowerShop\Bootstrap;

[
	'product'           => $product,
	'meta'              => $meta,
	'default_image_src' => $default_image_src,
	'is_shop_closed'    => $is_shop_closed,
] = $args;

$img_id  = $product->get_image_id();
$img_src = \wp_get_attachment_image_src($img_id, [ 450, 450 ]) ?: [ $default_image_src ];

$name = $product->get_name();

$product_id = $meta['productId'] ?? '';
$variations = $meta['variations'] ?? [];

$price_arr         = [];
$regular_price_arr = [];

foreach ($variations as $variation) {
	if (empty( (int) $variation['salesPrice'])) {
		$price_arr[] = (int) $variation['regularPrice'];
	} else {
		$price_arr[] = (int) $variation['salesPrice'];
	}
	$regular_price_arr[] = (int) $variation['regularPrice'];
}

$filtered_price_arr = array_filter(
	$price_arr,
	function ( $price ) {
		return !empty($price);
	}
	);

$max               = empty($filtered_price_arr) ? '' : max($filtered_price_arr);
$min               = empty($filtered_price_arr) ? '' : min($filtered_price_arr);
$max_regular_price = empty($regular_price_arr) ? '' : max($regular_price_arr);

if (strpos($_SERVER['REQUEST_URI'], Bootstrap::KEBAB) === false) {
	// 如果不包含 Bootstrap::KEBAB 字串，有可能在其他編輯器預覽，則不加入 ps-not-ready class
	$class = '';
} else {
	// 如果包含 Bootstrap::KEBAB 字串，則加入 ps-not-ready class
	$class = 'ps-not-ready';
}

?>
<div data-ps-product-id="<?php echo $product_id; ?>" class="group relative pb-12 <?php echo $is_shop_closed ? 'pointer-events-none' : ''; ?> <?php echo $class; ?>">
	<div class="w-full aspect-square overflow-hidden">
		<img src="<?php echo $img_src[0]; ?>" class="group-hover:scale-125 duration-300 w-full aspect-square object-cover" alt="<?php echo $name; ?>">
	</div>
	<div class="mt-2">
		<?php echo $name; ?>
	</div>
	<div>
		<?php if ($max === $min && !empty($min)) : ?>
			<?php if ($max === $max_regular_price) : ?>
				<p class="mb-0 mt-1">NT$ <?php echo $min; ?></p>
			<?php else : ?>
				<p class="mb-0 mt-1"><del>NT$ <?php echo $max_regular_price; ?></del></p>
				<p class="mb-0 mt-1 text-red-500">NT$ <?php echo $min; ?></p>
			<?php endif; ?>
		<?php else : ?>
			<?php if (!empty($max_regular_price)) : ?>
				<p class="mb-0 mt-1"><del>NT$ <?php echo $max_regular_price; ?></del></p>
			<?php endif; ?>
			<?php if (!empty($max)) : ?>
				<p class="mb-0 mt-1 text-red-500">NT$ <?php echo $min; ?> – NT$ <?php echo $max; ?></p>
			<?php endif; ?>
		<?php endif; ?>
	</div>

	<button type="button" <?php echo $is_shop_closed ? 'disabled' : ''; ?> class="ps-btn ps-btn-primary w-full absolute bottom-0"><span><?php echo $is_shop_closed ? '商店已關閉' : '加入購物車'; ?></span></button>
</div>
