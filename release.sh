#!/bin/bash

release_folder='fast-shop-release'
release_zip='fast-shop-release.zip'
folder_array=("inc" "js/dist")
file_array=("plugin.php" "README.md" "LICENSE")

# 使用for循环遍历数组并执行指令
for folder in "${folder_array[@]}"; do
	rm -rf ../$release_folder/$folder
  cp -r ./$folder ../$release_folder/$folder
done

for file in "${file_array[@]}"; do
	rm -rf ../$release_folder/$file
  cp ./$file ../$release_folder/$file
done



# create zip
cd ../$release_folder
tar -czf ../$release_zip .

echo '✅ Release created'
