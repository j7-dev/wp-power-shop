#!/bin/bash

release_folder='power-shop-release'
release_zip='power-shop-release.zip'
folder_array=("inc" "js/dist")
file_array=("plugin.php" "README.md" "LICENSE" ".env.production")
full_version=$(grep -oP "Version: \K.*" plugin.php)

# remove old release
rm -rf ../$release_zip

# 使用for循环遍历数组并执行指令
for folder in "${folder_array[@]}"; do
	rm -rf ../$release_folder/$folder
  cp -r ./$folder ../$release_folder/$folder
done

for file in "${file_array[@]}"; do
	rm -rf ../$release_folder/$file
  cp ./$file ../$release_folder/$file
done

# rename folder
# mv ../$release_folder ../$release_folder-v$full_version

# create zip
# zip -r ../$release_zip ../$release_folder

echo '✅ Release created'
