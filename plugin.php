<?php

/**
 * Plugin Name:       Power Shop | 讓你的商店充滿 Power
 * Plugin URI:        https://cloud.luke.cafe/plugins/power-shop/
 * Description:       Power Shop 是一個 WordPress 套件，安裝後，可以讓你的 Woocommerce 商店變成可以提供給多人使用的一頁商店，並且可以讓使用者自訂商品的價格，以及統計每個一頁商店的訂單狀態與銷售額
 * Version:           1.2.17
 * Requires at least: 5.7
 * Requires PHP:      7.4
 * Author:            J7
 * Author URI:        https://github.com/j7-dev
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       power-shop
 * Domain Path:       /languages
 * Tags: woocommerce, shop, order
 */

namespace J7\WpReactPlugin;

use J7\WpReactPlugin\PowerShop\Inc\Bootstrap;
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

\add_action('plugins_loaded', __NAMESPACE__ . '\checkDependency');
function checkDependency()
{
    if (!class_exists('WooCommerce', false)) {
        \add_action('admin_notices', __NAMESPACE__ . '\dependencyNotice');
    } else {
        require_once __DIR__ . "/inc/index.php";
        require_once __DIR__ . "/licenser/class-power-shop-base.php";
        new PowerShop();
    }
}

// 顯示 WooCommerce 未安裝的通知
function dependencyNotice(): void
{
    ?>
<div class="notice notice-error is-dismissible">
<p>使用 Power Shop 外掛必須先安裝並啟用 <a href="https://tw.wordpress.org/plugins/woocommerce/" target="_blank">Woocommerce</a> ，請先安裝並啟用 <a href="https://tw.wordpress.org/plugins/woocommerce/" target="_blank">Woocommerce</a></p>
</div>
<?php
}

class PowerShop
{
    public $plugin_file = __FILE__;
    public $response_obj;
    public $license_message;
    public $show_message   = false;
    public $plugin_version = '';
    public $text_domain    = '';

    const APP_NAME         = 'Power Shop';
    const KEBAB            = 'power-shop';
    const SNAKE            = 'power_shop';
    const BUY_LICENSE_LINK = 'https://cloud.luke.cafe/plugins/power-shop';
    const SUPPORT_EMAIL    = 'cloud@luke.cafe';
    const BASE_URL         = '/';
    const RENDER_ID_1      = 'power_shop_added_products_app';
    const RENDER_ID_2      = 'power_shop_statistic_app';
    const RENDER_ID_3      = 'power_shop_products_app';
    const RENDER_ID_4      = 'power_shop_report_app';
    const API_TIMEOUT      = '30000';
    const GITHUB_REPO      = 'https://github.com/j7-dev/wp-power-shop';

    public function __construct()
    {

        /**
         * wp plugin 更新檢查 update checker
         */

        $updateChecker = PucFactory::buildUpdateChecker(
            Bootstrap::GITHUB_REPO,
            __FILE__,
            Bootstrap::KEBAB
        );

        $updateChecker->getVcsApi()->enableReleaseAssets();

        /**
         * ---
         */
        add_action('admin_print_styles', [ $this, 'set_admin_style' ]);
        $this->set_plugin_data();
        $main_lic_key = "PowerShop_lic_Key";
        $lic_key_name = \Power_Shop_Base::get_lic_key_param($main_lic_key);
        $license_key  = get_option($lic_key_name, "");
        if (empty($license_key)) {
            $license_key = get_option($main_lic_key, "");
            if (!empty($license_key)) {
                update_option($lic_key_name, $license_key) || add_option($lic_key_name, $license_key);
            }
        }
        $lice_email = get_option("PowerShop_lic_email", "");
        \Power_Shop_Base::add_on_delete(function () {
            update_option("PowerShop_lic_Key", "");
        });
        if (\Power_Shop_Base::check_wp_plugin($license_key, $lice_email, $this->license_message, $this->response_obj, __FILE__)) {
            add_action('admin_menu', [ $this, 'active_admin_menu' ], 99999);
            add_action('admin_post_PowerShop_el_deactivate_license', [ $this, 'action_deactivate_license' ]);
            //$this->licenselMessage=$this->mess;
            //***Write you plugin's code here***

        } else {
            if (!empty($license_key) && !empty($this->license_message)) {
                $this->show_message = true;
            }
            update_option($license_key, "") || add_option($license_key, "");
            add_action('admin_post_PowerShop_el_activate_license', [ $this, 'action_activate_license' ]);
            add_action('admin_menu', [ $this, 'inactive_menu' ]);
        }
    }
    public function set_plugin_data()
    {
        if (!function_exists('get_plugin_data')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        if (function_exists('get_plugin_data')) {
            $data = get_plugin_data($this->plugin_file);
            if (isset($data[ 'Version' ])) {
                $this->plugin_version = $data[ 'Version' ];
            }
            if (isset($data[ 'TextDomain' ])) {
                $this->text_domain = $data[ 'TextDomain' ];
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
            if (!empty($server[ 'HTTP_HOST' ]) && !empty($server[ 'SCRIPT_NAME' ])) {
                $base_url = ((isset($server[ 'HTTPS' ]) && $server[ 'HTTPS' ] == 'on') ? 'https' : 'http');
                $base_url .= '://' . $server[ 'HTTP_HOST' ];
                $base_url .= str_replace(basename($server[ 'SCRIPT_NAME' ]), '', $server[ 'SCRIPT_NAME' ]);

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
        wp_register_style("PowerShopLic", plugins_url("_lic_style.css", __DIR__ . '/licenser/_lic_style.css'), 10, time());
        wp_enqueue_style("PowerShopLic");
    }
    public function active_admin_menu()
    {

        add_submenu_page('edit.php?post_type=power-shop', "PowerShop License", "License Info", "activate_plugins", Bootstrap::KEBAB . "-license", [ $this, "activated" ]);
    }
    public function inactive_menu()
    {
        add_submenu_page('edit.php?post_type=power-shop', "PowerShop License", "License Info", "activate_plugins", Bootstrap::KEBAB . "-license", [ $this, "license_form" ]);
    }
    public function action_activate_license()
    {
        check_admin_referer('el-license');
        $license_key   = !empty($_POST[ 'el_license_key' ]) ? sanitize_text_field(wp_unslash($_POST[ 'el_license_key' ])) : "";
        $license_email = !empty($_POST[ 'el_license_email' ]) ? sanitize_email(wp_unslash($_POST[ 'el_license_email' ])) : "";
        update_option("PowerShop_lic_Key", $license_key) || add_option("PowerShop_lic_Key", $license_key);
        update_option("PowerShop_lic_email", $license_email) || add_option("PowerShop_lic_email", $license_email);
        update_option('_site_transient_update_plugins', '');
        wp_safe_redirect(admin_url('edit.php?post_type=power-shop&page=power-shop-license'));
    }
    public function action_deactivate_license()
    {
        check_admin_referer('el-license');
        $message      = "";
        $main_lic_key = "PowerShop_lic_Key";
        $lic_key_name = \Power_Shop_Base::get_lic_key_param($main_lic_key);
        if (\Power_Shop_Base::remove_license_key(__FILE__, $message)) {
            update_option($lic_key_name, "") || add_option($lic_key_name, "");
            update_option('_site_transient_update_plugins', '');
        }
        wp_safe_redirect(admin_url('edit.php?post_type=power-shop&page=power-shop-license'));
    }

    public function activated()
    {

        ?>
		<form class="pt-24 w-fit mx-auto" method="post"
			action="<?php echo \esc_url(admin_url('admin-post.php')); ?>">
			<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 z-50 relative">
				<div class="sm:mx-auto sm:w-full sm:max-w-sm">
				<input type="hidden" name="action" value="PowerShop_el_deactivate_license" />



					<!-- <img class="h-16 mx-auto w-auto" src="https://morepower.club/wp-content/uploads/2020/10/powerlogo-y.png"> -->
					<h2 class="text-gray-700 text-center text-4xl font-black leading-9 tracking-tight">站長路可</h2>
					<h2 class="text-gray-700 mt-10 mb-4 text-center text-2xl font-bold leading-9 tracking-tight">
						<?php esc_html_e("Power Shop 授權", "power-shop");?>
					</h2>
					<?php
if (!empty($this->show_message) && !empty($this->license_message)) {
            ?>
						<div class="notice notice-error is-dismissible">
							<p>
								<?php echo \esc_html($this->license_message, "power-shop"); ?>
							</p>
						</div>
						<?php
}
        ?>
					<p class='text-gray-500'>請輸入授權碼以開通進階功能，購買授權請到<a target="_blank" class="font-semibold leading-6 text-primary hover:text-primary-400" href="<?=Bootstrap::BUY_LICENSE_LINK;?>">站長路可網站</a>購買
					有任何客服問題，請私訊站長路可網站右下方對話框，或是來信 <a href="mailto:<?=Bootstrap::SUPPORT_EMAIL;?>" target="_blank" class="font-semibold leading-6 text-primary hover:text-primary-400">
						<?=Bootstrap::SUPPORT_EMAIL;?>
					</a></p>
				</div>

				<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<table class="table table-fixed table-small th-left">
						<tbody>
							<tr>
								<th>
									<?php \esc_html_e("狀態", "power-shop");?>
								</th>
								<td>
									<?php if ($this->response_obj->is_valid): ?>
										<span class="text-white bg-teal-400 rounded-md px-2 py-1">
											<?php \esc_html_e("啟用", "power-shop");?>
										</span>
									<?php else: ?>
										<span class="text-white bg-crimson-400 rounded-md px-2 py-1">
											<?php \esc_html_e("尚未啟用", "power-shop");?>
										</span>
									<?php endif;?>
								</td>
							</tr>
							<tr>
								<th>
									<?php \esc_html_e("授權種類", "power-shop");?>
								</th>
								<td>
									<?php echo \esc_html($this->response_obj->license_title, "power-shop"); ?>
								</td>
							</tr>
							<tr>
								<th>
									<?php \esc_html_e("到期日", "power-shop");?>
								</th>
								<td>
									<?php echo \esc_html($this->response_obj->expire_date, "power-shop");
        if (!empty($this->response_obj->expire_renew_link)) {
            ?>
										<a target="_blank" class="el-blue-btn"
											href="<?php echo \esc_url($this->response_obj->expire_renew_link); ?>">購買授權</a>
										<?php
}
        ?>
								</td>
							</tr>
							<tr>
								<th>
									<?php \esc_html_e("支援更新時間", "power-shop");?>
								</th>
								<td>
									<?php
echo esc_html($this->response_obj->support_end, "power-shop");

        if (!empty($this->response_obj->support_renew_link)) {
            ?>
										<a target="_blank" class="el-blue-btn"
											href="<?php echo \esc_url($this->response_obj->support_renew_link); ?>">購買授權</a>
										<?php
}
        ?>
								</td>
							</tr>
							<tr>
								<th>
									<?php \esc_html_e("授權碼", "power-shop");?>
								</th>
								<td>
									<?php echo \esc_attr(substr($this->response_obj->license_key, 0, 9) . "XXXXXXXX-XXXXXXXX" . substr($this->response_obj->license_key, -9)); ?>
								</td>
							</tr>
						</tbody>
					</table>


					<div class="mt-8">
						<button type="submit"
							class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">棄用授權</button>
					</div>

					<p class="mt-10 text-center text-sm text-gray-400">
						網站速度不夠快？
						<a target="_blank" href="https://cloud.luke.cafe/"
							class="font-semibold leading-6 text-primary hover:text-primary-400">我們的主機代管服務</a>
						提供30天免費試用
					</p>
					<?php \wp_nonce_field('el-license');?>

				</div>
			</div>
		</form>

		<?php
$this->get_background_html();
    }

    public function license_form()
    {
        ?>
		<form class="pt-24 w-fit mx-auto" method="post"
			action="<?php echo \esc_url(\admin_url('admin-post.php')); ?>">
			<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 z-50 relative">
				<div class="sm:mx-auto sm:w-full sm:max-w-sm">
					<input type="hidden" name="action" value="PowerShop_el_activate_license" />


					<!-- <img class="h-16 mx-auto w-auto" src="https://morepower.club/wp-content/uploads/2020/10/powerlogo-y.png"> -->
					<h2 class="text-gray-700 text-center text-4xl font-black leading-9 tracking-tight">站長路可</h2>
					<h2 class="text-gray-700 mt-10 mb-4 text-center text-2xl font-bold leading-9 tracking-tight">
						<?php \esc_html_e("Power Shop授權", "power-shop");?>
					</h2>
					<?php
if (!empty($this->show_message) && !empty($this->license_message)) {
            ?>
						<div class="notice notice-error is-dismissible">
							<p>
								<?php echo \esc_html($this->license_message, "power-shop"); ?>
							</p>
						</div>
						<?php
}
        ?>

					<p class='text-gray-500'>請輸入授權碼以開通進階功能，購買授權請到<a target="_blank" class="font-semibold leading-6 text-primary hover:text-primary-400" href="<?=Bootstrap::BUY_LICENSE_LINK;?>">站長路可網站</a>購買
					有任何客服問題，請私訊站長路可網站右下方對話框，或是來信 <a href="mailto:<?=Bootstrap::SUPPORT_EMAIL;?>" target="_blank" class="font-semibold leading-6 text-primary hover:text-primary-400">
						<?=Bootstrap::SUPPORT_EMAIL;?>
					</a></p>

					<input id="el_license_key" type="text"
						class="h-[36px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
						name="el_license_key" size="50" placeholder="xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx"
						required="required">
				</div>


			<div class="mb-4">
				<label for="el_license_email" class="block text-sm font-medium leading-6 text-gray-500">
					<?php echo esc_html("Email", "power-shop"); ?>
				</label>
				<div class="mt-2">
					<?php
$purchase_email = \get_option("PowerShop_lic_email", \get_bloginfo('admin_email'));
        ?>
					<input id="el_license_email" type="email"
						class="h-[36px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
						name="el_license_email" size="50" value="<?php echo \esc_html($purchase_email); ?>"
						placeholder="" required="required">
				</div>
			</div>

			<div class="mt-8">
				<button type="submit"
					class="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">啟用授權</button>
			</div>
		</form>

		<p class="mt-10 text-center text-sm text-gray-400">
			網站速度不夠快？
			<a target="_blank" href="https://cloud.luke.cafe/"
				class="font-semibold leading-6 text-primary hover:text-primary-400">我們的主機代管服務</a> 提供30天免費試用
		</p>
		<?php wp_nonce_field('el-license');?>

		</div>
		</div>
		</form>
		<?php
$this->get_background_html();
    }

    public function get_background_html()
    {
        ?>
		<style>
			table.table {
				color: #334155;
				width: 100%;
				border-collapse: collapse;
				table-layout: auto;
				/* 让列宽自动分配 */
			}

			table.table.table-fixed {
				table-layout: fixed;
				/* 让列宽平均分配 */
			}

			table.table tr {
				background-color: transparent;
				transition: 0.3s ease-in-out;
			}

			table.table tr:hover {
				color: #4096ff;
			}

			table.table td,
			table.table th {
				width: auto;
				border: 0px solid #ddd;
				padding: 0.75rem 0.5rem;
				line-height: 1;
			}

			table.table th {
				width: 90px;
			}

			table.table.table-small td,
			table.table.table-small th {
				padding: 0.5rem 0rem;
				font-size: 0.75rem;
			}

			table.table.table-nowrap td,
			table.table.table-nowrap th {
				white-space: nowrap;
			}

			table.table td {
				text-align: right;
			}

			table.table.th-left th {
				text-align: left;
			}

			table.table th {
				text-align: center;
				font-weight: 700;
			}

			table.table.table-vertical {
				table-layout: fixed;
			}

			table.table.table-vertical tr {
				display: flex;
				border-bottom: 1px solid #ddd;
			}

			table.table.table-vertical th {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				background-color: #f8f8f8;
				border: none;
				width: 15rem;
			}

			table.table.table-vertical th * {
				text-align: left;
			}

			table.table.table-vertical td {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				flex: 1;
				border: none;
			}
			#wpfooter{
				display: none !important;
			}
		</style>
		<script src="https://cdn.tailwindcss.com"></script>
		<script>		tailwind.config = {			theme: {				extend: {					colors: {						primary: '#1677ff',						'primary-400': '#4096ff',					}				}			}		}
		</script>

		<?php
}

}
