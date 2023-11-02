<?php

namespace J7\ViteReactWPPlugin\PowerShop;

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__, '/../.env.production');
$dotenv->safeLoad();

require_once __DIR__ . '/admin.php';


$instance = new Admin\Bootstrap();
$instance->init();

require_once __DIR__ . '/custom/includes.php';
