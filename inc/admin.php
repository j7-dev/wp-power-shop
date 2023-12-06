<?php

declare (strict_types = 1);

namespace J7\ViteReactWPPlugin\PowerShop\Admin;

use Kucrut\Vite;

/**
 * [ ] - 使用COUPON
 */

class Bootstrap
{
    public function init(): void
    {
        \add_action('admin_enqueue_scripts', [ $this, 'enqueue_script' ], 99);
        \add_action('wp_enqueue_scripts', [ $this, 'enqueue_script' ], 99);
        // \add_action('wp_footer', [$this, 'render_app']);

        \add_action('wp_insert_post', [ $this, 'set_default_value_on_power_shop_create' ], 10, 3);
    }

    /**
     * Render application's markup
     */
    public function render_app(): void
    {
        \printf('<div id="my-app" class="my-app"></div>');
    }

    /**
     * Enqueue script
     */
    public function enqueue_script(): void
    {
        $post_id = \get_the_ID();
        if (!$post_id) {
            return;
        }

        if (\is_admin()) {
            // 後台網頁 screen id 必須符合才引入
            $screen = \get_current_screen();
            if (($screen->id !== \PowerShop::KEBAB)) {
                return;
            }
        } else {
            // 前台網頁必須包含 {\PowerShop::KEBAB} 字串 才引用
            if (strpos($_SERVER[ 'REQUEST_URI' ], \PowerShop::KEBAB) === false) {
                return;
            }
        }

        // if (!\is_admin() && ($screen->id !== \PowerShop::KEBAB)) return;
        Vite\enqueue_asset(
            dirname(__DIR__) . '/js/dist',
            'js/src/main.tsx',
            [
                'handle'    => \PowerShop::KEBAB,
                'in-footer' => true,
             ]
        );

        // get checkout url
        global $woocommerce;
        $checkout_page_url = function_exists('wc_get_cart_url') ?
        \wc_get_checkout_url() : $woocommerce->cart->get_checkout_url();

        $permalink     = \get_permalink($post_id);
        $products_info = Functions::get_products_info($post_id);

        // 找出指定的 meta_id by meta_key
        // _report_password & _settings 欄位都是用 Modal儲存，不用往自訂欄位塞值
        global $wpdb;
        $power_shop_meta_meta_id = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT meta_id FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = %s",
                $post_id,
                \PowerShop::SNAKE . '_meta'
            )
        );

        $settings_string = \get_post_meta($post_id, \PowerShop::SNAKE . '_settings', true);
        $settings        = Functions::json_parse($settings_string, [  ], true);
        $btn_color       = $settings[ 'btnColor' ] ?? '#1677ff';

        \wp_localize_script(
            \PowerShop::KEBAB,
            'appData',
            array(
                'products_info' => $products_info,
                'settings'      => [
                    'power_shop_meta_meta_id' => $power_shop_meta_meta_id,
                    'colorPrimary'            => $btn_color,
                    'isConfetti'              => $settings[ 'isConfetti' ] ?? true,
                 ],
                'env'           => [
                    'siteUrl'     => \site_url(),
                    'ajaxUrl'     => \admin_url('admin-ajax.php'),
                    'ajaxNonce'   => \wp_create_nonce(\PowerShop::KEBAB),
                    'userId'      => \wp_get_current_user()->data->ID,
                    'postId'      => $post_id,
                    'permalink'   => $permalink,
                    'checkoutUrl' => $checkout_page_url,
                    "APP_NAME"    => \PowerShop::APP_NAME,
                    "KEBAB"       => \PowerShop::KEBAB,
                    "SNAKE"       => \PowerShop::SNAKE,
                    "BASE_URL"    => \PowerShop::BASE_URL,
                    "RENDER_ID_1" => \PowerShop::RENDER_ID_1,
                    "RENDER_ID_2" => \PowerShop::RENDER_ID_2,
                    "RENDER_ID_3" => \PowerShop::RENDER_ID_3,
                    "RENDER_ID_4" => \PowerShop::RENDER_ID_4,
                    "API_TIMEOUT" => \PowerShop::API_TIMEOUT,
                 ],
                'template'      => \get_page_template_slug($post_id),
            ),
        );

        \wp_localize_script(
            \PowerShop::KEBAB,
            'wpApiSettings',
            array(
                'root'  => \esc_url_raw(rest_url()),
                'nonce' => \wp_create_nonce('wp_rest'),
            )
        );

        // 获取目录中的所有文件
        $files = glob(self::get_plugin_dir() . '/js/dist/assets/*.css');

        // 遍历文件并使用wp_enqueue_style加载它们
        foreach ($files as $file) {
            $file_url = self::get_plugin_url() . '/js/dist/assets/' . basename($file);
            \wp_enqueue_style(basename($file, '.css'), $file_url);
        }
    }

    public function set_default_value_on_power_shop_create($post_ID, $post, $update)
    {
        // POSTTYPE 為 "power-shop" 且 是新增操作 且 安裝了 Elementor 才執行
        if ($post->post_type === \PowerShop::KEBAB && !$update && defined('ELEMENTOR_VERSION')) {
            \update_post_meta($post_ID, '_wp_page_template', 'elementor_header_footer');
        }
    }

    public static function get_plugin_dir(): string
    {
        $plugin_dir = \wp_normalize_path(\plugin_dir_path(__DIR__ . '../'));
        return $plugin_dir;
    }

    public static function get_plugin_url(): string
    {
        $plugin_url = \plugin_dir_url(self::get_plugin_dir() . 'plugin.php');
        return $plugin_url;
    }

    public static function get_plugin_ver(): string
    {
        $plugin_data = \get_plugin_data(self::get_plugin_dir() . 'plugin.php');
        $plugin_ver  = $plugin_data[ 'Version' ];
        return $plugin_ver;
    }
}
