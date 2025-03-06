<?php
/**
 * Plugin Name:       Power Shop
 * Plugin URI:        [YOUR GITHUB URL]/power-shop
 * Description:       your description
 * Version:           0.0.1
 * Requires at least: 5.7
 * Requires PHP:      8.0
 * Author:            Your Name
 * Author URI:        [YOUR GITHUB URL]
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       power_shop
 * Domain Path:       /languages
 * Tags: your tags
 */

declare (strict_types = 1);

namespace J7\PowerShop;

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly
}

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

		// self::$template_page_names = [ '404' ];

		$this->required_plugins = [
			// [
			// 'name'     => 'WooCommerce',
			// 'slug'     => 'woocommerce',
			// 'required' => true,
			// 'version'  => '7.6.0',
			// ],
			// [
			// 'name'     => 'Powerhouse',
			// 'slug'     => 'powerhouse',
			// 'source'   => '[YOUR GITHUB URL]/wp-powerhouse/releases/latest/download/powerhouse.zip',
			// 'version'  => '2.0.14',
			// 'required' => true,
			// ],
		];

		$this->init(
			[
				'app_name'    => 'Power Shop',
				'github_repo' => '[YOUR GITHUB URL]/power-shop',
				'callback'    => [ Bootstrap::class, 'instance' ],
			]
		);
	}
}

Plugin::instance();
