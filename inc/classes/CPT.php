<?php
/**
 * Power Shop CPT
 */

declare (strict_types = 1);

namespace J7\PowerShop;

/**
 * class CPT
 */
final class CPT {
	use \J7\WpUtils\Traits\SingletonTrait;


	const VAR = 'ps_report';

	const POST_META    = [ 'meta', 'settings' ];
	const CPT_LABEL    = 'Power Shop';
	const CPT_SLUG     = 'power-shop';
	const LICENSE_LINK = 'admin.php?page=powerhouse-license-codes';
	const COLOR        = '#72aee6';

	const RENDER_ID_1      = Bootstrap::RENDER_ID_1;
	const RENDER_ID_2      = Bootstrap::RENDER_ID_2;
	const BUY_LICENSE_LINK = Bootstrap::BUY_LICENSE_LINK;
	const SUPPORT_EMAIL    = Bootstrap::SUPPORT_EMAIL;

	private $count = 0;
	private $iel   = true;

	public function __construct() {
		\add_action( 'init', [ $this, 'init' ] );
		\add_action( 'rest_api_init', [ $this, 'add_post_meta' ] );

		\add_action( 'load-post.php', [ $this, 'init_metabox' ] );
		\add_action( 'load-post-new.php', [ $this, 'init_metabox' ] );

		\add_filter( 'query_vars', [ $this, 'add_query_for_report' ] );
		\add_filter( 'template_include', [ $this, 'load_report_template' ], 999 );

		\add_action( 'wp_insert_post', [ $this, 'set_default_power_shop_meta' ], 10, 3 );

		\add_action( 'publish_' . self::CPT_SLUG, [ $this, 'post_published_limit' ], 999, 3 );
		\add_filter( 'post_row_actions', [ $this, 'remove_row_actions' ], 999, 2 );

		\add_action('admin_menu', [ $this, 'add_lc_submenu' ], 999);
		\add_action('admin_enqueue_scripts', [ $this, 'limit_css_and_js' ], 999);
		\add_action('admin_head', [ $this, 'limit_admin_head' ], 999, 1);
		\add_action('admin_notices', [ $this, 'limit_admin_notices' ], 999);
	}

	public function add_query_for_report( $vars ) {
		$vars[] = self::VAR;
		return $vars;
	}

	public function init(): void {
		Functions::register_cpt( self::CPT_LABEL );

		// 新增 {Plugin::$kebab}/{slug}/report 網址規則
		\add_rewrite_rule( '^' . self::CPT_SLUG . '/([^/]+)/report/?$', 'index.php?post_type=' . self::CPT_SLUG . '&name=$matches[1]&' . self::VAR . '=1', 'top' );

		\flush_rewrite_rules();

		if (\J7\Powerhouse\LC::ia(Bootstrap::KEBAB)) {
			$this->iel = false;
			return;
		}

		$count = \wp_count_posts(self::CPT_SLUG);

		$this->count = $count->publish + $count->draft;

		$this->iel = AXD::gt($this->count);
	}

	public function add_post_meta(): void {
		foreach ( self::POST_META as $meta_key ) {
			\register_meta(
				'post',
				Plugin::$snake . '_' . $meta_key,
				[
					'type'         => 'string',
					'show_in_rest' => true,
					'single'       => true,
				]
			);
		}
	}

	/**
	 * Meta box initialization.
	 */
	public function init_metabox(): void {
		\add_action( 'add_meta_boxes', [ $this, 'add_metaboxs' ] );
		\add_filter( 'rewrite_rules_array', [ $this, 'custom_post_type_rewrite_rules' ] );
	}

	public function custom_post_type_rewrite_rules( $rules ) {
		global $wp_rewrite;
		if ( is_object( $wp_rewrite ) && ! is_null( $wp_rewrite ) ) {
			$wp_rewrite->flush_rules();
		}
		return $rules;
	}

	/**
	 * Adds the meta box.
	 */
	public function add_metaboxs(): void {
		Functions::add_metabox(
			[
				'id'    => self::RENDER_ID_1,
				'label' => __( 'Added Products', Plugin::$kebab ),
			]
		);
		Functions::add_metabox(
			[
				'id'    => self::RENDER_ID_2,
				'label' => __( 'Sales Stats', Plugin::$kebab ),
			]
		);
	}

	/**
	 * 設定 {Plugin::$kebab}/{slug}/report 的 php template
	 */
	public function load_report_template( $template ) {
		$repor_template_path = Plugin::$dir . '/inc/templates/report.php';

		if ( \get_query_var( self::VAR ) ) {
			if ( file_exists( $repor_template_path ) ) {
				return $repor_template_path;
			}
		}
		return $template;
	}

	/**
	 * 設定預設的 post meta data
	 */
	public function set_default_power_shop_meta( $post_id, $post, $update ) {
		// Get the post object
		$post = \get_post( $post_id );

		// 剛創建時，且 post type === Plugin::$kebab
		if ( ! $update && $post->post_type === self::CPT_SLUG ) {
			// Add default post_meta
			$default_password   = \wp_create_nonce( Plugin::$kebab );
			$encrypted_password = base64_encode( $default_password );

			\add_post_meta( $post_id, Plugin::$snake . '_report_password', $encrypted_password, true );
			\add_post_meta( $post_id, Plugin::$snake . '_meta', '[]', true );
		}
	}

	public function post_published_limit( $post_id, $post, $old_status ) {
		if ( $this->iel ) {
			$post = [ 'post_status' => 'draft' ];
			\wp_update_post( $post );
		}
	}

	public function remove_row_actions( $actions, $post ) {
		if ( self::CPT_SLUG === $post->post_type ) {
			unset( $actions['inline hide-if-no-js'] );
			return $actions;
		}
		return $actions;
	}

	public function limit_admin_head() {
		$screen = \get_current_screen();
		if ( 'edit-' . self::CPT_SLUG !== $screen->id ) {
			return;
		}

		$shop_ids = \get_posts(
			[
				'post_type'      => self::CPT_SLUG,
				'post_status'    => 'publish',
				'fields'         => 'ids',
				'posts_per_page' => -1,
			]
		);

		if ( $this->iel && ! empty( $shop_ids ) ) {
			foreach ( $shop_ids as $key => $shop_id ) {
				if ( $key !== 0 ) {
					\wp_update_post(
						[
							'ID'          => $shop_id,
							'post_status' => 'draft',
						]
					);
				}
			}
		}
	}

	public function limit_css_and_js() {
		if ( $this->iel ) {
			\wp_enqueue_style( self::CPT_SLUG, Plugin::$url . '/inc/assets/css/main.css' );
			\wp_enqueue_style( 'jquery-confirm', Plugin::$url . '/inc/assets/packages/jquery-confirm/jquery-confirm.min.css' );
			\wp_enqueue_script( 'jquery-confirm', Plugin::$url . '/inc/assets/packages/jquery-confirm/jquery-confirm.min.js', [ 'jquery' ], '3.3.4', true );
			\wp_enqueue_script( self::CPT_SLUG, Plugin::$url . '/inc/assets/js/main.js', [ 'jquery-confirm' ], Plugin::$version, true );
			wp_localize_script(
				self::CPT_SLUG,
				'powerShopData',
				[
					'buyLink'      => self::BUY_LICENSE_LINK,
					'licenseLink'  => \admin_url( self::LICENSE_LINK ),
					'supportEmail' => self::SUPPORT_EMAIL,
				]
			);
		}
	}

	public function limit_admin_notices() {
		$screen = \get_current_screen();

		if (!\class_exists('\J7\Powerhouse\LC')) {
			return;
		}

		if ( 'edit-' . self::CPT_SLUG !== $screen->id || \J7\Powerhouse\LC::ia(Bootstrap::KEBAB) ) {
			return;
		}

		$buy_link      = self::BUY_LICENSE_LINK;
		$license_link  = \admin_url( self::LICENSE_LINK );
		$support_email = self::SUPPORT_EMAIL;
		$color         = self::COLOR;

		$html = <<<EOD
		<div id='power-shop-reminder' class="notice notice-info is-dismissible" style="border-left-color:$color;">
			<div class="e-notice__content">
				<h3>升級PowerShop，讓你的商店更有POWER!</h3>

				<p>您現在使用的是免費版的Power Shop外掛，僅能發佈一個商店。升級付費版，即可解鎖完整功能</p>

				<div style="display: flex;margin-bottom:1rem;">
					<a href="$license_link" class="button button-large" style="border-color:$color;color:$color;">輸入授權碼</a>
				</div>
				<a href="#" id="hide-reminder">不要再顯示</a>
			</div>
		</div>
EOD;
		echo $html;
	}

	public function add_lc_submenu() {
		\add_submenu_page(
			'edit.php?post_type=' . self::CPT_SLUG,
			'授權碼',
			'授權碼',
			'manage_options',
			'admin.php?page=powerhouse-license-codes',
			''
			);
	}
}
