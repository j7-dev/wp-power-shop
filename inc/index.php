<?php

namespace J7\ViteReactWPPlugin\PowerShop;

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__, '/../.env.production');
$dotenv->safeLoad();

$_ENV['KEBAB'] = str_replace(' ', '-', strtolower($_ENV['APP_NAME']));
$_ENV['SNAKE'] = str_replace(' ', '_', strtolower($_ENV['APP_NAME']));
$_ENV['APP_SLUG'] = $_ENV['KEBAB'];


require_once __DIR__ . '/admin.php';


$instance = new Admin\Bootstrap();
$instance->init();

require_once __DIR__ . '/custom/includes.php';
