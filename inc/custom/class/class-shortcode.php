<?php

declare(strict_types=1);

namespace J7\WpReactPlugin\PowerShop\Inc;

class ShortCode
{
	function __construct()
	{
		\add_shortcode(Bootstrap::SNAKE . '_products', [$this, 'shortcode_callback']);
	}

	public function shortcode_callback(): string
	{
		// 每次進到頁面先清空購物車 #45
		// if (!is_admin()) {
		//     try {
		//         \WC()->cart->empty_cart();
		//     } catch (\Throwable $th) {
		//         //throw $th;
		//         // do nothing
		//     }
		// }

		// 如果不是 power shop 頁面，就不 render
		if (strpos($_SERVER['REQUEST_URI'], Bootstrap::KEBAB) === false) {
			return 'Power Shop 只能在 Power Shop 頁面使用';
		}

		// 取得 power shop meta 資料
		global $post;
		$meta_string     = \get_post_meta($post->ID, Bootstrap::SNAKE . '_meta', true);
		$shop_meta       = Functions::json_parse($meta_string, [], true);
		$settings_string = \get_post_meta($post->ID, Bootstrap::SNAKE . '_settings', true);
		$settings        = Functions::json_parse($settings_string, [], true);
		$enable_virtual_list = $settings['enableVirtualList'] ?? false;
		var_dump($enable_virtual_list);

		if (!empty($settings['endTime'])) {
			$is_shop_closed = $settings['endTime'] < (time() * 1000);
		} else {
			$is_shop_closed = false;
		}

		$btn_color = $settings['btnColor'] ?? '#1677ff';

		$handled_shop_meta = $this->handleShopMeta($shop_meta);

		$html = '';
		ob_start();
?>
		<?php if (!$enable_virtual_list) : ?>
			<style>
				:root {
					--ps-primary: <?= $btn_color ?>;
				}
			</style>
			<div class="power-shop-products">
				<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
					<?php foreach ($handled_shop_meta as $meta) {
						$product_id        = $meta['productId'];
						$product           = \wc_get_product($product_id);
						$product_type      = $product->get_type();
						$default_image_src = Bootstrap::get_plugin_url() . '/js/src/assets/images/defaultImage.jpg';
						switch ($product_type) {
							case 'variable':
								\load_template(Bootstrap::get_plugin_dir() . '/inc/templates/single-product/variable.php', false, [
									'product'           => $product,
									'meta'              => $meta,
									'default_image_src' => $default_image_src,
									'is_shop_closed'    => $is_shop_closed,
								]);
								break;
							case 'simple':
								\load_template(Bootstrap::get_plugin_dir() . '/inc/templates/single-product/simple.php', false, [
									'product'           => $product,
									'meta'              => $meta,
									'default_image_src' => $default_image_src,
									'is_shop_closed'    => $is_shop_closed,
								]);
								break;
							default:
								\load_template(Bootstrap::get_plugin_dir() . '/inc/templates/single-product/simple.php', false, [
									'product'           => $product,
									'meta'              => $meta,
									'default_image_src' => $default_image_src,
									'is_shop_closed'    => $is_shop_closed,
								]);
								break;
						}
					}
					?>
				</div>
			</div>
		<?php endif; ?>
		<div id="<?= Bootstrap::RENDER_ID_3 ?>"></div>
<?php
		$html .= ob_get_clean();

		return $html;
	}

	/**
	 * 檢查 shop_meta 裡面的商品與 woocommerce 裡面的商品是否 type 一致
	 * 如果不一致，就更新 shop_meta 裡面的 data
	 *
	 * @param array $shop_meta
	 * @return array
	 */
	private function handleShopMeta(array $shop_meta): array
	{
		$need_update = false;
		// 檢查當前的 shop_meta 裡面的商品與 woocommerce 裡面的商品是否 type 一致
		foreach ($shop_meta as $key => $meta) {
			$meta_product_type = $meta['productType'] ?? '';
			if (empty($meta_product_type)) {
				// 如果舊版本用戶沒有存到 productType，就判斷給個預設值
				$is_variable_product = !empty($meta['variations']);
				$meta_product_type   = $is_variable_product ? 'variable' : 'simple';
			}

			$product_id   = $meta['productId'];
			$product      = \wc_get_product($product_id);
			$product_type = $product->get_type();

			if ($meta_product_type !== $product_type) {
				$need_update = true;
				// 如果不一致，就更新 shop_meta 裡面的 productType
				$shop_meta[$key]['productType'] = $product_type;

				if ($product_type === 'simple') {
					$shop_meta[$key] = [
						"productId"    => $product_id,
						"productType"  => $product_type,
						"regularPrice" => $product->get_regular_price(),
						"salesPrice"   => $product->get_sale_price(),
					];
				}

				if ($product_type === 'variable') {
					$variations          = $product->get_available_variations();
					$formattedVariations = [];

					foreach ($variations as $variation) {
						$formattedVariations[] = [
							"variationId"  => $variation['variation_id'],
							"regularPrice" => $variation['display_regular_price'],
							"salesPrice"   => $variation['display_price'],
						];
					}

					$shop_meta[$key] = [
						"productId"   => $product_id,
						"productType" => $product_type,
						"variations"  => $formattedVariations,
					];
				}
			}
		}

		if ($need_update) {
			// 更新 post_meta
			global $post;
			\update_post_meta($post->ID, Bootstrap::SNAKE . '_meta', \wp_json_encode($shop_meta));
		}

		return $shop_meta;
	}
}

new ShortCode();
