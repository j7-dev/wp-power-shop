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
		$shop_meta = Functions::json_parse($meta_string);


		$html = '';
		ob_start();
?>
		<div class="power-shop-products">
			<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
				<div class="relative pb-12 cursor-pointer">
					<div>
						<img src="https://projectmars.shop/wp-content/uploads/2021/05/PNG去背.png" class="w-full aspect-square">
					</div>
					<div class="m-0">
						<div>Booster MINI 3<br>肌肉放鬆迷你強力筋膜槍</div>
					</div>
					<div>$Infinity – $-Infinity</div><button type="button" class="ant-btn css-fpg3f5 ant-btn-primary w-full absolute bottom-0"><span>加入購物車</span></button>
				</div>
			</div>
		</div>
		<div id="<?= $_ENV['VITE_RENDER_ID_3'] ?>"></div>
<?php
		$html .= ob_get_clean();


		return $html;
	}
}

new ShortCode();
