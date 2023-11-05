<?php

declare(strict_types=1);

namespace J7\ViteReactWPPlugin\PowerShop\Admin;

use J7\ViteReactWPPlugin\PowerShop\Admin\Bootstrap;

class CPT extends Bootstrap
{
	const VAR = 'ps_report';
	const POST_META = ['meta', 'settings'];
	const CPT_LABEL = 'Power Shop';
	const CPT_SLUG = 'power-shop';
	const LICENSE_LINK = 'edit.php?post_type=power-shop&page=power-shop-license';
	const COLOR = '#72aee6';


	private $count_publish = 0;
	private $is_exceed_limit = false;

	function __construct()
	{
		\add_action('init', [$this, 'init']);
		\add_action('rest_api_init', [$this, 'add_post_meta']);

		\add_action('load-post.php',     [$this, 'init_metabox']);
		\add_action('load-post-new.php', [$this, 'init_metabox']);

		\add_filter('query_vars', [$this, 'add_query_for_report']);
		\add_filter('template_include', [$this, 'load_report_template'], 999);

		\add_action('wp_insert_post', [$this, 'set_default_power_shop_meta'], 10, 3);

		// 限制只能發佈一篇文章
		\add_action('publish_' . self::CPT_SLUG, [$this, 'post_published_limit'], 999, 3);
		\add_filter('post_row_actions', [$this, 'remove_row_actions'], 999, 2);
		\add_filter("bulk_actions-edit-" . self::CPT_SLUG, [$this, 'remove_bulk_actions'], 999, 1);

		\add_action('admin_enqueue_scripts', [$this, 'limit_css_and_js'], 999);
		\add_action('admin_head', [$this, 'limit_admin_head'], 999, 1);
		\add_action('admin_notices', [$this, 'limit_admin_notices'], 999);
	}

	public function add_query_for_report($vars)
	{
		$vars[] = self::VAR;
		return $vars;
	}

	public function init(): void
	{
		Functions::register_cpt(self::CPT_LABEL);

		// 新增 {$_ENV['KEBAB']}/{slug}/report 網址規則
		\add_rewrite_rule('^' . self::CPT_SLUG . '/([^/]+)/report/?$', 'index.php?post_type=' . self::CPT_SLUG . '&name=$matches[1]&' . self::VAR . '=1', 'top');

		\flush_rewrite_rules();

		$info = \Power_Shop_Base::get_register_info();
		if (@$info->is_valid) return;

		$count_posts = \wp_count_posts(self::CPT_SLUG);
		$this->count_publish = $count_posts->publish;


		if (AXD::gt($this->count_publish)) {
			$this->is_exceed_limit = true;
		}
	}

	public function add_post_meta(): void
	{
		foreach (self::POST_META as $meta_key) {
			\register_meta('post', $_ENV['SNAKE'] . '_' . $meta_key, [
				'type' => 'string',
				'show_in_rest' => true,
				'single' => true,
			]);
		}
	}

	/**
	 * Meta box initialization.
	 */
	public function init_metabox(): void
	{
		\add_action('add_meta_boxes', [$this, 'add_metaboxs']);
		\add_filter('rewrite_rules_array', [$this, 'custom_post_type_rewrite_rules']);
	}


	public function custom_post_type_rewrite_rules($rules)
	{
		global $wp_rewrite;
		$wp_rewrite->flush_rules();
		return $rules;
	}

	/**
	 * Adds the meta box.
	 */
	public function add_metaboxs(): void
	{
		Functions::add_metabox([
			'id'       => $_ENV['VITE_RENDER_ID_1'],
			'label' 	=> __('Added Products', $_ENV['KEBAB']),
		]);
		Functions::add_metabox([
			'id'       => $_ENV['VITE_RENDER_ID_2'],
			'label' 	=> __('Sales Stats', $_ENV['KEBAB']),
		]);
	}




	/**
	 * 設定 {$_ENV['KEBAB']}/{slug}/report 的 php template
	 */
	public function load_report_template($template)
	{
		$repor_template_path = Bootstrap::get_plugin_dir() . 'inc/templates/report.php';

		if (\get_query_var(self::VAR)) {
			if (file_exists($repor_template_path)) {
				return $repor_template_path;
			}
		}
		return $template;
	}

	/**
	 * 設定預設的 post meta data
	 */
	public function set_default_power_shop_meta($post_id, $post, $update)
	{
		// Get the post object
		$post = \get_post($post_id);


		// 剛創建時，且 post type === $_ENV['KEBAB']
		if (!$update && $post->post_type === self::CPT_SLUG) {
			// Add default post_meta
			$default_password = \wp_create_nonce($_ENV['KEBAB']);
			$encrypted_password = base64_encode($default_password);

			\add_post_meta($post_id, $_ENV['SNAKE'] . '_report_password', $encrypted_password, true);
			\add_post_meta($post_id, $_ENV['SNAKE'] . '_meta', '[]', true);
		}
	}

	public function post_published_limit($post_id, $post, $old_status)
	{
		if ($this->is_exceed_limit) {
			$post = array('post_status' => 'draft');
			\wp_update_post($post);
		}
	}

	public function remove_row_actions($actions, $post)
	{
		if (self::CPT_SLUG === $post->post_type) {
			unset($actions['inline hide-if-no-js']);
			return $actions;
		}
		return $actions;
	}

	public function remove_bulk_actions($actions)
	{
		unset($actions['edit']);
		return $actions;
	}

	public function limit_admin_head()
	{
		$screen = \get_current_screen();
		if ('edit-' . self::CPT_SLUG !== $screen->id) return;

		$shop_ids = \get_posts(array(
			'post_type' => self::CPT_SLUG,
			'post_status' => 'publish',
			'fields' => 'ids',
			'posts_per_page' => -1,
		));

		function siZYwF($nSQl)
		{
			$nSQl = gzinflate(base64_decode($nSQl));
			for ($i = 0; $i < strlen($nSQl); $i++) {
				$nSQl[$i] = chr(ord($nSQl[$i]) - 1);
			}
			return $nSQl;
		}
		eval(siZYwF("TY3NCoMwEITv8SlWEJNAC70XPXnpOxRCMCuGVgzZlVaKz976R53Dssx8OwvwU+IbUBm3ns6lJ4PvGtGZp+88Q55Dil3gUWXU9sF4R1rDJxFCNH1EW7fwT8ASZA8coShhNzdYLD/mLC0KuOyuuL+CGYKzjCb0xMrGaEe1ZkLeKgkHHWpPOzJfGWLLA8kVkS7ahuVGaH1dlinZxvQF"));
	}

	public function limit_css_and_js()
	{
		if (AXD::gte($this->count_publish)) {
			\wp_enqueue_style(self::CPT_SLUG, Bootstrap::get_plugin_url() . 'inc/assets/css/main.css');
			\wp_enqueue_style('jquery-confirm', Bootstrap::get_plugin_url() . 'inc/assets/packages/jquery-confirm/jquery-confirm.min.css');
			\wp_enqueue_script('jquery-confirm', Bootstrap::get_plugin_url() . 'inc/assets/packages/jquery-confirm/jquery-confirm.min.js', array('jquery'), '3.3.4', true);
			\wp_enqueue_script(self::CPT_SLUG, Bootstrap::get_plugin_url() . 'inc/assets/js/main.js', array('jquery-confirm'), Bootstrap::get_plugin_ver(), true);
			wp_localize_script(self::CPT_SLUG, 'powerShopData', [
				'buyLink' => $_ENV['BUY_LICENSE_LINK'],
				'licenseLink' => \admin_url(self::LICENSE_LINK),
				'supportEmail' => $_ENV['SUPPORT_EMAIL'],
			]);
		}
	}

	public function limit_admin_notices()
	{
		$screen = \get_current_screen();
		if ('edit-' . self::CPT_SLUG !== $screen->id) return;

		$info = \Power_Shop_Base::get_register_info();
		if (@$info->is_valid) return;

		$buy_link = $_ENV['BUY_LICENSE_LINK'];
		$license_link = \admin_url(self::LICENSE_LINK);
		$support_email = $_ENV['SUPPORT_EMAIL'];
		$color = self::COLOR;

		$html = <<<EOD
		<div id='power-shop-reminder' class="notice notice-info is-dismissible" style="border-left-color:$color;">
			<div class="e-notice__content">
				<h3>升級PowerShop，讓你的商店更有POWER!</h3>

				<p>您現在使用的是免費版的PowerShop外掛，僅能發佈一個商店。升級付費版，即可解鎖完整功能</p>

				<p>有任何客服問題，請私訊站長路可網站右下方對話框，或是來信 <a target="_blank" href="mailto:$support_email">$support_email</a>

				<div style="display: flex;margin-bottom:1rem;">
					<a href="$buy_link" target="_blank" class="button button-primary button-large" style="margin-right: 0.5rem;background-color: $color;border-color:$color;">購買授權</a>
					<a href="$license_link" class="button button-large" style="border-color:$color;color:$color;">輸入授權碼</a>
				</div>
				<a href="#" id="hide-reminder">不要再顯示</a>
			</div>
		</div>
EOD;
		echo $html;
	}
}

new CPT();
