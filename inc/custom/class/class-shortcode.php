<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;

use J7\ViteReactWPPlugin\FastShop\Admin\Bootstrap;

class ShortCode
{
	function __construct()
	{
		\add_shortcode(Bootstrap::DB_DOMAIN . '_products', [$this, 'shortcode_callback']);
		\add_action('woocommerce_before_checkout_form', [$this, 'render_app']);
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
<div id="fast_shop_products_app"></div>
		<?php
		// \wc_get_template( 'checkout/form-checkout.php', array( 'checkout' => $checkout ) );
		$html .= ob_get_clean();
		// [ ] - 隱藏購物車跟COUPON

		return $html;
	}

	public function render_app(): void
	{
		?>
		<div id="fast_shop_products_app"></div>
		<?php
	}

}
