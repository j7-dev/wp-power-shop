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
		// self::checkout();
		$html .= ob_get_clean();

		return $html;
	}

	private static  function checkout(){
		// Show non-cart errors.
		\do_action( 'woocommerce_before_checkout_form_cart_notices' );

		// Check cart has contents.
		if ( \WC()->cart->is_empty() && ! \is_customize_preview() && \apply_filters( 'woocommerce_checkout_redirect_empty_cart', true ) ) {
			return;
		}

		// Check cart contents for errors.
		\do_action( 'woocommerce_check_cart_items' );

		// Calc totals.
		\WC()->cart->calculate_totals();

		// Get checkout object.
		$checkout = \WC()->checkout();

		if ( empty( $_POST ) && \wc_notice_count( 'error' ) > 0 ) { // WPCS: input var ok, CSRF ok.

			\wc_get_template( 'checkout/cart-errors.php', array( 'checkout' => $checkout ) );
			\wc_clear_notices();

		} else {

			$non_js_checkout = ! empty( $_POST['woocommerce_checkout_update_totals'] ); // WPCS: input var ok, CSRF ok.

			if ( \wc_notice_count( 'error' ) === 0 && $non_js_checkout ) {
				\wc_add_notice( __( 'The order totals have been updated. Please confirm your order by pressing the "Place order" button at the bottom of the page.', 'woocommerce' ) );
			}

			// default path (look in plugin file!)
			$default_path = \untrailingslashit( Bootstrap::PLUGIN_DIR) . '/templates/';

			\wc_get_template( 'checkout/form-checkout.php', array( 'checkout' => $checkout ), '', $default_path );

		}

	}
}
