<?php

declare (strict_types = 1);

namespace J7\WpReactPlugin\PowerShop\Inc;

class Api
{
    const POSTMETA_API_ENDPOINT       = 'postmeta';
    const AJAX_NONCE_ENDPOINT         = 'ajaxnonce';
    const PURGE_KINSTA_CACHE_ENDPOINT = 'purge_kinsta_cache';

    function __construct()
    {
        foreach ([ self::POSTMETA_API_ENDPOINT, self::AJAX_NONCE_ENDPOINT, self::PURGE_KINSTA_CACHE_ENDPOINT ] as $action) {
            \add_action('rest_api_init', [ $this, "register_{$action}_api" ]);
        }
    }

    public function postmeta_callback($request)
    {
        $post_id = $request[ 'id' ];

        // 檢查文章是否存在
        if (\get_post_status($post_id)) {
            $post_meta           = \get_post_meta($post_id);
            $formatted_post_meta = [  ];
            foreach ($post_meta as $key => $value) {
                $formatted_post_meta[ $key ] = $value[ 0 ];
            }

            // 在此處理 post_meta 資訊，你可以根據需要進行資料處理

            return \rest_ensure_response($formatted_post_meta);
        } else {
            return new \WP_Error('post_not_found', '文章不存在', array('status' => 404));
        }
    }

    public function register_postmeta_api()
    {
        $endpoint = self::POSTMETA_API_ENDPOINT;
        \register_rest_route('wrp', "{$endpoint}/(?P<id>\d+)", array(
            'methods'  => 'GET',
            'callback' => [ $this, "{$endpoint}_callback" ],
        ));
    }

    public function ajaxnonce_callback()
    {
        $ajaxNonce = \wp_create_nonce(Bootstrap::KEBAB);

        return \rest_ensure_response($ajaxNonce);

    }

    public function register_ajaxnonce_api()
    {
        $endpoint = self::AJAX_NONCE_ENDPOINT;
        \register_rest_route('wrp', "{$endpoint}", array(
            'methods'  => 'GET',
            'callback' => [ $this, "{$endpoint}_callback" ],
        ));
    }

    public function purge_kinsta_cache_callback()
    {
        if (class_exists('Kinsta\Cache_Purge')) {
            try {
                $response = wp_remote_get('https://localhost/kinsta-clear-cache-all', [
                    'sslverify' => false,
                    'timeout'   => 5,
                 ]);
                return \rest_ensure_response($response);
            } catch (\Throwable $th) {
                throw $th;
            }

        }
        return \rest_ensure_response('not find kinsta mu-plugin');
    }

    public function register_purge_kinsta_cache_api()
    {
        $endpoint = self::PURGE_KINSTA_CACHE_ENDPOINT;
        \register_rest_route('wrp', "{$endpoint}", array(
            'methods'  => 'GET',
            'callback' => [ $this, "{$endpoint}_callback" ],
        ));
    }

}

new Api();
