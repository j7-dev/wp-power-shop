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
		// \WC()->cart->empty_cart();

		// Get checkout object.
		$checkout = \WC()->checkout();
		$html = '';
		ob_start();
		?>
			<div class="fast_shop_products_app">
				<div id="fast_shop_products_app"></div>
				<?php  // echo \do_shortcode( '[woocommerce_checkout]' ) ?>
			</div>
		<?php
		$html .= ob_get_clean();


		return $html;
	}


}
