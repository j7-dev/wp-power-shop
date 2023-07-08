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
		$html = '';
		ob_start();
		?>
			<div id="fast_shop_products_app"></div>
		<?php
		$html .= ob_get_clean();
		// [ ] - 隱藏購物車跟COUPON
		$html .= do_shortcode( '[woocommerce_checkout]' );

		return $html;
	}

}
