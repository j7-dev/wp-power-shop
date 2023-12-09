<?php

namespace J7\WpReactPlugin\PowerShop;

require_once __DIR__ . '/../vendor/autoload.php';

require_once __DIR__ . '/admin.php';

$instance = new Inc\Bootstrap();
$instance->init();

require_once __DIR__ . '/custom/includes.php';
