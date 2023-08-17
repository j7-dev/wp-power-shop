<?php
require_once "class-power-shop-pro-base.php";
class PowerShopPro
{
	public $plugin_file = __FILE__;
	public $response_obj;
	public $license_message;
	public $show_message = false;
	public $slug = "power-shop-pro";
	public $plugin_version = '';
	public $text_domain = '';
	function __construct()
	{
		add_action('admin_print_styles', [$this, 'set_admin_style']);
		$this->set_plugin_data();
		$main_lic_key = "PowerShopPro_lic_Key";
		$lic_key_name = Power_Shop_Pro_Base::get_lic_key_param($main_lic_key);
		$license_key = get_option($lic_key_name, "");
		if (empty($license_key)) {
			$license_key = get_option($main_lic_key, "");
			if (!empty($license_key)) {
				update_option($lic_key_name, $license_key) || add_option($lic_key_name, $license_key);
			}
		}
		$lice_email = get_option("PowerShopPro_lic_email", "");
		Power_Shop_Pro_Base::add_on_delete(function () {
			update_option("PowerShopPro_lic_Key", "");
		});
		if (Power_Shop_Pro_Base::check_wp_plugin($license_key, $lice_email, $this->license_message, $this->response_obj, __FILE__)) {
			add_action('admin_menu', [$this, 'active_admin_menu'], 99999);
			add_action('admin_post_PowerShopPro_el_deactivate_license', [$this, 'action_deactivate_license']);
			//$this->licenselMessage=$this->mess;
			//***Write you plugin's code here***

		} else {
			if (!empty($license_key) && !empty($this->license_message)) {
				$this->show_message = true;
			}
			update_option($license_key, "") || add_option($license_key, "");
			add_action('admin_post_PowerShopPro_el_activate_license', [$this, 'action_activate_license']);
			add_action('admin_menu', [$this, 'inactive_menu']);
		}
	}
	public function set_plugin_data()
	{
		if (!function_exists('get_plugin_data')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		if (function_exists('get_plugin_data')) {
			$data = get_plugin_data($this->plugin_file);
			if (isset($data['Version'])) {
				$this->plugin_version = $data['Version'];
			}
			if (isset($data['TextDomain'])) {
				$this->text_domain = $data['TextDomain'];
			}
		}
	}
	private static function &get_server_array()
	{
		return $_SERVER;
	}
	private static function get_raw_domain()
	{
		if (function_exists("site_url")) {
			return site_url();
		}
		if (defined("WPINC") && function_exists("get_bloginfo")) {
			return get_bloginfo('url');
		} else {
			$server = self::get_server_array();
			if (!empty($server['HTTP_HOST']) && !empty($server['SCRIPT_NAME'])) {
				$base_url  = ((isset($server['HTTPS']) && $server['HTTPS'] == 'on') ? 'https' : 'http');
				$base_url .= '://' . $server['HTTP_HOST'];
				$base_url .= str_replace(basename($server['SCRIPT_NAME']), '', $server['SCRIPT_NAME']);

				return $base_url;
			}
		}
		return '';
	}
	private static function get_raw_wp()
	{
		$domain = self::get_raw_domain();
		return preg_replace("(^https?://)", "", $domain);
	}
	public static function get_lic_key_param($key)
	{
		$raw_url = self::get_raw_wp();
		return $key . "_s" . hash('crc32b', $raw_url . "vtpbdapps");
	}
	public function set_admin_style()
	{
		wp_register_style("PowerShopProLic", plugins_url("_lic_style.css", $this->plugin_file), 10, time());
		wp_enqueue_style("PowerShopProLic");
	}
	public function active_admin_menu()
	{
		add_submenu_page('edit.php?post_type=power-shop', "PowerShopPro License", "License Info", "activate_plugins",  $this->slug . "-license", [$this, "activated"]);
	}
	public function inactive_menu()
	{
		add_submenu_page('edit.php?post_type=power-shop', "PowerShopPro License", "License Info", "activate_plugins",  $this->slug . "-license", [$this, "license_form"]);
	}
	function action_activate_license()
	{
		check_admin_referer('el-license');
		$license_key = !empty($_POST['el_license_key']) ? sanitize_text_field(wp_unslash($_POST['el_license_key'])) : "";
		$license_email = !empty($_POST['el_license_email']) ? sanitize_email(wp_unslash($_POST['el_license_email'])) : "";
		update_option("PowerShopPro_lic_Key", $license_key) || add_option("PowerShopPro_lic_Key", $license_key);
		update_option("PowerShopPro_lic_email", $license_email) || add_option("PowerShopPro_lic_email", $license_email);
		update_option('_site_transient_update_plugins', '');
		wp_safe_redirect(admin_url('edit.php?post_type=power-shop&page=power-shop-pro-license'));
	}
	function action_deactivate_license()
	{
		check_admin_referer('el-license');
		$message = "";
		$main_lic_key = "PowerShopPro_lic_Key";
		$lic_key_name = Power_Shop_Pro_Base::get_lic_key_param($main_lic_key);
		if (Power_Shop_Pro_Base::remove_license_key(__FILE__, $message)) {
			update_option($lic_key_name, "") || add_option($lic_key_name, "");
			update_option('_site_transient_update_plugins', '');
		}
		wp_safe_redirect(admin_url('edit.php?post_type=power-shop&page=power-shop-pro-license'));
	}
	function activated()
	{
?>
		<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
			<input type="hidden" name="action" value="PowerShopPro_el_deactivate_license" />
			<div class="el-license-container">
				<h3 class="el-license-title"><i class="dashicons-before dashicons-star-filled"></i> <?php esc_html_e("Power Shop Pro License Info", "power-shop-pro"); ?> </h3>
				<hr>
				<ul class="el-license-info">
					<li>
						<div>
							<span class="el-license-info-title"><?php esc_html_e("Status", "power-shop-pro"); ?></span>

							<?php if ($this->response_obj->is_valid) : ?>
								<span class="el-license-valid"><?php esc_html_e("Valid", "power-shop-pro"); ?></span>
							<?php else : ?>
								<span class="el-license-valid"><?php esc_html_e("Invalid", "power-shop-pro"); ?></span>
							<?php endif; ?>
						</div>
					</li>

					<li>
						<div>
							<span class="el-license-info-title"><?php esc_html_e("License Type", "power-shop-pro"); ?></span>
							<?php echo esc_html($this->response_obj->license_title, "power-shop-pro"); ?>
						</div>
					</li>

					<li>
						<div>
							<span class="el-license-info-title"><?php esc_html_e("License Expired on", "power-shop-pro"); ?></span>
							<?php echo esc_html($this->response_obj->expire_date, "power-shop-pro");
							if (!empty($this->response_obj->expire_renew_link)) {
							?>
								<a target="_blank" class="el-blue-btn" href="<?php echo esc_url($this->response_obj->expire_renew_link); ?>">Renew</a>
							<?php
							}
							?>
						</div>
					</li>

					<li>
						<div>
							<span class="el-license-info-title"><?php esc_html_e("Support Expired on", "power-shop-pro"); ?></span>
							<?php
							echo esc_html($this->response_obj->support_end, "power-shop-pro");;
							if (!empty($this->response_obj->support_renew_link)) {
							?>
								<a target="_blank" class="el-blue-btn" href="<?php echo esc_url($this->response_obj->support_renew_link); ?>">Renew</a>
							<?php
							}
							?>
						</div>
					</li>
					<li>
						<div>
							<span class="el-license-info-title"><?php esc_html_e("Your License Key", "power-shop-pro"); ?></span>
							<span class="el-license-key"><?php echo esc_attr(substr($this->response_obj->license_key, 0, 9) . "XXXXXXXX-XXXXXXXX" . substr($this->response_obj->license_key, -9)); ?></span>
						</div>
					</li>
				</ul>
				<div class="el-license-active-btn">
					<?php wp_nonce_field('el-license'); ?>
					<?php submit_button('Deactivate'); ?>
				</div>
			</div>
		</form>
	<?php
	}

	function license_form()
	{
	?>
		<form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
			<input type="hidden" name="action" value="PowerShopPro_el_activate_license" />
			<div class="el-license-container">
				<h3 class="el-license-title"><i class="dashicons-before dashicons-star-filled"></i> <?php esc_html_e("Power Shop Pro Licensing", "power-shop-pro"); ?></h3>
				<hr>
				<?php
				if (!empty($this->show_message) && !empty($this->license_message)) {
				?>
					<div class="notice notice-error is-dismissible">
						<p><?php echo esc_html($this->license_message, "power-shop-pro"); ?></p>
					</div>
				<?php
				}
				?>
				<p>請輸入授權碼以開通進階功能，購買授權請到<a target="_blank" href="https://cloud.luke.cafe/product/power-shop/">站長路可網站</a>購買
					有任何客服問題，請私訊站長路可網站右下方對話框，或是來信 <a href="mailto:cloud@luke.cafe" target="_blank">cloud@luke.cafe</a></p>
				<div class="el-license-field">
					<label for="el_license_key"><?php echo esc_html("License code", "power-shop-pro"); ?></label>
					<input type="text" class="regular-text code" name="el_license_key" size="50" placeholder="xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx" required="required">
				</div>
				<div class="el-license-field">
					<label for="el_license_key"><?php echo esc_html("Email Address", "power-shop-pro"); ?></label>
					<?php
					$purchase_email   = get_option("PowerShopPro_lic_email", get_bloginfo('admin_email'));
					?>
					<input type="text" class="regular-text code" name="el_license_email" size="50" value="<?php echo esc_html($purchase_email); ?>" placeholder="" required="required">
					<div><small><?php echo esc_html("We will send update news of this product by this email address, don't worry, we hate spam", "power-shop-pro"); ?></small></div>
				</div>
				<div class="el-license-active-btn">
					<?php wp_nonce_field('el-license'); ?>
					<?php submit_button('Activate'); ?>
				</div>
			</div>
		</form>
<?php
	}
}

new PowerShopPro();
