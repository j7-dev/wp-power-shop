<?php

[
	'product' => $product,
	'meta' => $meta,
] = $args;

$img_id = $product->get_image_id();
$img_src = wp_get_attachment_image_src($img_id, [450, 450]) ?? [];
$name = $product->get_name();

[
	'productId' => $product_id,
	'variations' => $variations,
] = $meta;

$price_arr = [];
foreach ($variations as $variation) {
	$price_arr[] = (int) $variation['regularPrice'];
	$price_arr[] = (int) $variation['salesPrice'];
}
$filtered_price_arr = array_filter($price_arr, function ($price) {
	return !empty($price);
});

$max = max($filtered_price_arr);
$min = min($filtered_price_arr);


?>
<div data-ps-product-id="<?= $product_id ?>" class="relative pb-12 cursor-pointer">
	<div>
		<img src="<?= $img_src[0] ?>" class="w-full aspect-square" alt="<?= $name ?>">
	</div>
	<div class="mt-2">
		<?= $name ?>
	</div>
	<div>
		<?php if (empty($min) || empty($max)) : ?>
			NT$ <?= empty($min) ? $max : $min ?>
		<?php else : ?>
			NT$ <?= $min ?> – NT$ <?= $max ?>
		<?php endif; ?>
	</div>

	<button type="button" class="ps-btn ps-btn-primary w-full absolute bottom-0"><span>加入購物車</span></button>
</div>