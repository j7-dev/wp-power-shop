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

		$html = '<div id="' . $_ENV['VITE_RENDER_ID_3'] . '"></div>';

		return $html;
	}
}

new ShortCode();
