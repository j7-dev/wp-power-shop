<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;

use J7\ViteReactWPPlugin\FastShop\Admin\Bootstrap;

class ShortCode
{
	function __construct()
	{
		\add_shortcode(Bootstrap::DB_DOMAIN . '_products', [$this, 'shortcode_callback']);
	}

	public function shortcode_callback()
	{
		// NOTE 每次進到頁面先清空購物車
		if (!is_admin()) {
			try {
				\WC()->cart->empty_cart();
			} catch (\Throwable $th) {
				//throw $th;
				// do nothing
			}
		}


		$html = '';
		ob_start();
?>
		<div id="fast_shop_products_app"></div>
<?php
		$html .= ob_get_clean();


		return $html;
	}
}
