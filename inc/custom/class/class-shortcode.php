<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop\Admin;

use J7\ViteReactWPPlugin\FastShop\Admin\Bootstrap;

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


		$html = '';
		ob_start();
?>
		<div id="<?= $_ENV['VITE_RENDER_ID_3'] ?>"></div>
<?php
		$html .= ob_get_clean();


		return $html;
	}
}
