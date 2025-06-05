<?php

declare(strict_types=1);

namespace J7\PowerShop\Admin;

use J7\WpUtils\Classes\General;
use J7\PowerShop\Plugin;
use J7\PowerShop\Bootstrap;
use J7\PowerShop\Utils\Base;
use J7\Powerhouse\Utils\Base as PowerhouseBase;

/** Admin Entry */
final class Entry {
	use \J7\WpUtils\Traits\SingletonTrait;

	/** Constructor */
	public function __construct() {
		\add_action('current_screen', [ $this, 'maybe_output_admin_page' ], 10);
		\add_action( 'admin_bar_menu', [ $this, 'admin_bar_item' ], 220 );
	}

	/** Output the dashboard admin page.  */
	public function maybe_output_admin_page(): void {
		// Exit if not in admin.
		if (!\is_admin()) {
			return;
		}

		if (!General::in_url([ 'page=power-shop' ])) {
			return;
		}

		self::render_page();

		exit;
	}

	/** Output landing page header. */
	public static function render_page(): void {
		Bootstrap::enqueue_script();
		$blog_name = \get_bloginfo('name');
		$id        = substr(Base::APP1_SELECTOR, 1);
		$app_name  = Plugin::$app_name;

		PowerhouseBase::render_admin_layout(
			[
				'title' => "{$app_name} | {$blog_name}",
				'id'    => $id,
			]
			);
	}

	/**
	 * 在管理員工具列中新增項目
	 *
	 * @param \WP_Admin_Bar $admin_bar 管理員工具列物件
	 *
	 * @return void
	 */
	public function admin_bar_item( \WP_Admin_Bar $admin_bar ): void {

		if ( ! \current_user_can( 'manage_woocommerce' ) ) {
			return;
		}

		global $product;
		$is_product = $product instanceof \WC_Product;

		if (!$is_product) {
			// 不是商品銷售頁就顯示商品列表
			$admin_bar->add_menu(
				[
					'id'     => Plugin::$kebab,
					'parent' => null,
					'group'  => null,
					'title'  => '電商系統', // you can use img tag with image link. it will show the image icon Instead of the title.
					'href'   => \admin_url('admin.php?page=power-shop#/dashboard'),
					'meta'   => [
						'title' => \__( '電商系統', 'power_shop' ), // This title will show on hover
					],
				]
			);
			return;
		}
		// 是商品銷售頁就顯示商品編輯
		$admin_bar->add_menu(
			[
				'id'     => Plugin::$kebab,
				'parent' => null,
				'group'  => null,
				'title'  => '編輯商品', // you can use img tag with image link. it will show the image icon Instead of the title.
				'href'   => \admin_url("admin.php?page=power-shop#/products/edit/{$product->get_id()}"),
				'meta'   => [
					'title' => \__( '編輯商品', 'power_shop' ), // This title will show on hover
				],
			]
		);
	}
}
