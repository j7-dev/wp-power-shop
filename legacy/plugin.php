<?php


declare (strict_types = 1);

namespace J7\PowerShopV2;

if ( \class_exists( 'J7\PowerShopV2\Plugin' ) ) {
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
		Bootstrap::instance();
	}
}

Plugin::instance();
