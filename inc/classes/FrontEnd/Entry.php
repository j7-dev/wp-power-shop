<?php
/**
 * Front-end Entry
 */

declare(strict_types=1);

namespace J7\PowerShop\FrontEnd;

use J7\PowerShop\Utils\Base;

if (class_exists('J7\PowerShop\FrontEnd\Entry')) {
	return;
}
/**
 * Class FrontEnd
 */
final class Entry {
	use \J7\WpUtils\Traits\SingletonTrait;

	/**
	 * Constructor
	 */
	public function __construct() {
		\add_action( 'wp_footer', [ __CLASS__, 'render_app' ] );
	}

	/**
	 * Render application's markup
	 */
	public static function render_app(): void {
		// phpcs:ignore
		echo '<div id="' . substr(Base::APP1_SELECTOR, 1) . '"></div>';
	}
}
