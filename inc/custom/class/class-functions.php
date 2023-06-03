<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\FastShop;


use J7\ViteReactWPPlugin\FastShop\Bootstrap;

class Functions
{
	public static function add_metabox(array $args): void
	{
		\add_meta_box(
			$args['id'],
			__($args['label'], Bootstrap::TEXT_DOMAIN),
			array(__CLASS__, 'render_metabox'),
			Bootstrap::TEXT_DOMAIN,
			'advanced',
			'default',
			array('id' => $args['id'])
		);
	}

	/**
	 * Renders the meta box.
	 */
	public static function render_metabox($post, $metabox): void
	{
		echo "<div id='{$metabox['args']['id']}'></div>";
	}
}
