<?php
/**
 * Plugin Name:       Power Shop | 讓你的商店充滿 Power
 * Plugin URI:        https://cloud.luke.cafe/plugins/power-shop/
 * Description:       Power Shop 是一個 WordPress 套件，安裝後，可以讓你的 Woocommerce 商店變成可以提供給多人使用的一頁商店，並且可以讓使用者自訂商品的價格，以及統計每個一頁商店的訂單狀態與銷售額
 * Version:           2.0.1
 * Requires at least: 5.7
 * Requires PHP:      8.0
 * Author:            J7
 * Author URI:        https://github.com/j7-dev
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       power_shop
 * Domain Path:       /languages
 * Tags: woocommerce, shop, order
 */

declare (strict_types = 1);

namespace J7\PowerShop;

if ( \class_exists( 'J7\PowerShop\Plugin' ) ) {
	return;
}

require_once __DIR__ . '/vendor/autoload.php';

/**
 * Class Plugin
 */
final class Plugin {
	use \J7\WpUtils\Traits\PluginTrait;
	use \J7\WpUtils\Traits\SingletonTrait;

	/**
	 * Constructor
	 */
	public function __construct() {

		$this->required_plugins = [
			[
				'name'     => 'Powerhouse',
				'slug'     => 'powerhouse',
				'source'   => 'https://github.com/j7-dev/wp-powerhouse/releases/latest/download/powerhouse.zip',
				'version'  => '2.0.0',
				'required' => true,
			],
			[
				'name'     => 'WooCommerce',
				'slug'     => 'woocommerce',
				'required' => true,
				'version'  => '7.6.0',
			],
		];

		$this->init(
			[
				'app_name'     => 'Power Shop',
				'github_repo'  => 'https://github.com/j7-dev/wp-power-shop',
				'callback'     => [ Bootstrap::class, 'instance' ],
				'lc'           => 'skip',
				'hide_submenu' => true,
			]
		);
	}
}

Plugin::instance();
