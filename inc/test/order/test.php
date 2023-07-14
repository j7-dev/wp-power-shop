<?php

$string = "aaa\n\n";
$string .= "bbb\n\n";
$o = str_replace("\n", "" . PHP_EOL, $string);
echo $o;
