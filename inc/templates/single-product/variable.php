<?php

[
	'product' => $product,
	'meta' => $meta,
	'default_image_src' => $default_image_src,
] = $args;

$img_id = $product->get_image_id();
$img_src = wp_get_attachment_image_src($img_id, [450, 450]) ?: [$default_image_src,];

$name = $product->get_name();

[
	'productId' => $product_id,
	'variations' => $variations,
] = $meta;

$price_arr = [];
$regular_price_arr = [];
foreach ($variations as $variation) {
	if (empty((int) $variation['salesPrice'])) {
		$price_arr[] = (int) $variation['regularPrice'];
	} else {
		$price_arr[] = (int) $variation['salesPrice'];
	}
	$regular_price_arr[] = (int) $variation['regularPrice'];
}

$filtered_price_arr = array_filter($price_arr, function ($price) {
	return !empty($price);
});

$max = max($filtered_price_arr);
$min = min($filtered_price_arr);
$max_regular_price = max($regular_price_arr);


?>
<div data-ps-product-id="<?= $product_id ?>" class="relative pb-12 ps-not-ready">
	<div>
		<img src="<?= $img_src[0] ?>" class="w-full aspect-square object-cover" alt="<?= $name ?>">
	</div>
	<div class="mt-2">
		<?= $name ?>
	</div>
	<div>
		<?php if ($max === $min) : ?>
			<?php if ($max === $max_regular_price) : ?>
				<p class="mb-0 mt-1">NT$ <?= $min ?></p>
			<?php endif; ?>
			<p class="mb-0 mt-1"><del>NT$ <?= $max_regular_price ?></del></p>
			<p class="mb-0 mt-1 text-red-500">NT$ <?= $min ?></p>
		<?php else : ?>
			<p class="mb-0 mt-1"><del>NT$ <?= $max_regular_price ?></del></p>
			<p class="mb-0 mt-1 text-red-500">NT$ <?= $min ?> – NT$ <?= $max ?></p>
		<?php endif; ?>
	</div>

	<button type="button" class="ps-btn ps-btn-primary w-full absolute bottom-0"><span>加入購物車</span></button>
</div>