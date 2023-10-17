<?php



[
	'product' => $product,
	'meta' => $meta,
	'default_image_src' => $default_image_src,
] = $args;

$img_id = $product->get_image_id();
$img_src = wp_get_attachment_image_src($img_id, [450, 450]) ?: [$default_image_src];
$name = $product->get_name();

[
	'productId' => $product_id,
	'regularPrice' => $regular_price,
	'salesPrice' => $sales_price,
] = $meta;

if (strpos($_SERVER['REQUEST_URI'], $_ENV['KEBAB']) === false) {
	// 如果不包含 $_ENV['KEBAB'] 字串，有可能在其他編輯器預覽，則不加入 ps-not-ready class
	$class = '';
} else {
	// 如果包含 $_ENV['KEBAB'] 字串，則加入 ps-not-ready class
	$class = 'ps-not-ready';
}

?>
<div data-ps-product-id="<?= $product_id ?>" class="relative pb-12 <?= $class ?>">
	<div>
		<img src="<?= $img_src[0] ?>" class="w-full aspect-square object-cover" alt="<?= $name ?>">
	</div>
	<div class="mt-2">
		<?= $name ?>
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