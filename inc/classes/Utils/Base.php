<?php

declare (strict_types = 1);

namespace J7\PowerShop\Utils;

use J7\Powerhouse\Utils\Base as PowerhouseUtils;
use J7\Powerhouse\Domains\Option\Core\WC_Settings;

/**
 * Class Utils
 */
abstract class Base {
	const BASE_URL      = '/';
	const APP1_SELECTOR = '#power_shop';
	const API_TIMEOUT   = '30000';
	const DEFAULT_IMAGE = 'http://1.gravatar.com/avatar/1c39955b5fe5ae1bf51a77642f052848?s=96&d=mm&r=g';

	/**
	 * Get WooCommerce settings
	 *
	 * @return array{
	 *  countries: array<string, string>,
	 *  currency: array{slug: string, symbol: string},
	 *  product_taxonomies: array<array{value:string, label:string}>,
	 *  notify_low_stock_amount: int,
	 *  dimension_unit: string,
	 *  weight_unit: string,
	 * }
	 */
	public static function get_woocommerce_settings(): array {
		if ( ! function_exists( '\WC' ) ) {
			return [];
		}

		$countries = \WC()->countries->get_countries();
		$currency  = \get_option( 'woocommerce_currency', 'TWD' );

		$wc_settings = WC_Settings::instance();

		$product_taxonomies = PowerhouseUtils::get_taxonomy_options();

		return [
			'countries'               => $countries,
			'currency'                => [
				'slug'   => $currency,
				'symbol' => html_entity_decode( \get_woocommerce_currency_symbol($currency) ),
			],
			'product_taxonomies'      => $product_taxonomies,
			'notify_low_stock_amount' => (int) $wc_settings->notify_low_stock_amount,
			'dimension_unit'          => $wc_settings->dimension_unit,
			'weight_unit'             => $wc_settings->weight_unit,
		];
	}
}
