<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\PowerShop\Admin;

class ShortCode
{
	function __construct()
	{
		\add_shortcode($_ENV['SNAKE'] . '_products', [$this, 'shortcode_callback']);
	}

	public function shortcode_callback()
	{
		// 每次進到頁面先清空購物車
		if (!is_admin()) {
			try {
				\WC()->cart->empty_cart();
			} catch (\Throwable $th) {
				//throw $th;
				// do nothing
			}
		}

		// 取得 power shop meta 資料
		global $post;
		$meta_string = \get_post_meta($post->ID, $_ENV['SNAKE'] . '_meta', true);
		$shop_meta = Functions::json_parse($meta_string, [], true);

		$html = '';
		ob_start();
?>
		<div class="power-shop-products">
			<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
				<?php foreach ($shop_meta as $meta) {
					$product_id = $meta['productId'];
					$product = \wc_get_product($product_id);
					$product_type = $product->get_type();
					$default_image_src = Bootstrap::get_plugin_url() . '/js/src/assets/images/defaultImage.jpg';
					switch ($product_type) {
						case 'variable':
							\load_template(Bootstrap::get_plugin_dir() . '/inc/templates/single-product/variable.php', false, [
								'product' => $product,
								'meta' => $meta,
								'default_image_src' => $default_image_src,
							]);
							break;
						case 'simple':
							\load_template(Bootstrap::get_plugin_dir() . '/inc/templates/single-product/simple.php', false, [
								'product' => $product,
								'meta' => $meta,
								'default_image_src' => $default_image_src,
							]);
							break;
						default:
							\load_template(Bootstrap::get_plugin_dir() . '/inc/templates/single-product/simple.php', false, [
								'product' => $product,
								'meta' => $meta,
								'default_image_src' => $default_image_src,
							]);
							break;
					}
				}
				?>
			</div>
		</div>
		<div id="<?= $_ENV['VITE_RENDER_ID_3'] ?>"></div>
<?php
		$html .= ob_get_clean();


		return $html;
	}
}

new ShortCode();
