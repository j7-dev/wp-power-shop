<?php

/**
 * Plugin Name: Boilerplate-React-SPA.WordPress-Plugin (BRSWP)
 * Description: BRSWP is a boilerplate for creating a WordPress plugin with React, Tailwind, TypeScript, React Query v4, SCSS and Vite.
 * Author: j7.dev
 * Author URI: https://github.com/j7-dev
 * License: GPLv2
 * Version: 0.0.1
 */

namespace J7\ViteReactWPPlugin;


require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/inc/frontend.php';


new Frontend\Bootstrap();
