#!/bin/bash

release_folder='power-shop-release'
release_zip='power-shop-release.zip'
folder_array=("js/dist" "inc")
file_array=("plugin.php" "LICENSE")
full_version=$(grep -oP "Version: \K.*" plugin.php)

# remove old release
rm -rf ../$release_zip

# 使用for循环遍历数组并执行指令
for folder in "${folder_array[@]}"; do
	rm -rf ../$release_folder/$folder
  cp -r ./$folder ../$release_folder/$folder
done

# 移除 class-cpt.php 將 class-cpt-encrypted.php 改名為 class-cpt.php
rm -f ../$release_folder/inc/custom/class/class-cpt.php
mv ../$release_folder/inc/custom/class/class-cpt-encrypted.php ../$release_folder/inc/custom/class/class-cpt.php

for file in "${file_array[@]}"; do
	rm -rf ../$release_folder/$file
  cp ./$file ../$release_folder/$file
done

# rename folder
# mv ../$release_folder ../$release_folder-v$full_version

# create zip
# zip -r ../$release_zip ../$release_folder

echo '✅ Release created'

cd ../$release_folder
git add .
git commit -m "Release v$full_version"
git push origin master

echo '✅ Release pushed to Github'
