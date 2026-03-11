<?php

declare(strict_types=1);

namespace J7\PowerShopV2;

/**
 * Class AXD
 */
final class AXD {

	/**
	 * Check if value is greater than 1.
	 *
	 * @param int $value The value to check.
	 * @return bool
	 */
	public static function gt( $value ) {
		return $value > 1;
	}

	/**
	 * Check if value is greater than or equal to 1.
	 *
	 * @param int $value The value to check.
	 * @return bool
	 */
	public static function gte( $value ) {
		return $value >= 1;
	}
}
