<?php


[
	'product' => $product,
	'meta' => $meta,
] = $args;

$img_id = $product->get_image_id();
$img_src = wp_get_attachment_image_src($img_id, [450, 450]) ?? [];
$title = get_the_title($product_id);
// var_dump($img);

[
	'productId' => $product_id,
	'regularPrice' => $regular_price,
	'salesPrice' => $sales_price,
] = $meta;


?>
<div class="relative pb-12 cursor-pointer">
	<div>
		<img src="<?= $img_src[0] ?>" class="w-full aspect-square" alt="<?= $title ?>">
	</div>
	<div class="mt-2">
		<?= $title ?>
	</div>
	<div>
		<?php if (!empty($sales_price)) : ?>
			<p class="mb-0 mt-1"><del>NT$ <?= $regular_price ?></del></p>
			<p class="mb-0 mt-1 text-red-500">NT$ <?= $sales_price ?></p>
		<?php else : ?>
			<p class="mb-0 mt-1">NT$ <?= $regular_price ?></p>
		<?php endif; ?>

	</div>

	<button type="button" class="ps-btn ps-btn-primary w-full absolute bottom-0"><span>加入購物車</span></button>
</div>