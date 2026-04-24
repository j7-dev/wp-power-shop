#!/usr/bin/env bash
# Upload media files to Bunny CDN
# Usage: upload-to-bunny.sh <source-dir> <media-prefix>
#
# Required env vars: BUNNY_STORAGE_HOST, BUNNY_STORAGE_ZONE,
#                    BUNNY_STORAGE_PASSWORD, BUNNY_CDN_URL
# Outputs to $GITHUB_OUTPUT: screenshot_files, video_files, media_url_prefix, has_media, upload_ok
#   - has_media:  true 若 source-dir 內有任何 .png / .webm 檔案
#   - upload_ok:  true 若所有上傳的檔案 HTTP 2xx（無媒體時保持 true，代表「無錯誤」）

set -euo pipefail

SOURCE_DIR="$1"
MEDIA_PREFIX="$2"
UPLOAD_OK=true

for file in "${SOURCE_DIR}"/*; do
  [ -f "$file" ] || continue
  filename=$(basename "$file")
  # 不使用 --fail：遇到 4xx/5xx 讓 curl 仍輸出 http_code，配合 || echo "000" 防止 set -e 中斷
  HTTP_CODE=$(curl --silent --output /dev/null --write-out "%{http_code}" \
    --request PUT \
    --url "https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/${MEDIA_PREFIX}/${filename}" \
    --header "AccessKey: ${BUNNY_STORAGE_PASSWORD}" \
    --header "Content-Type: application/octet-stream" \
    --data-binary "@${file}" || echo "000")
  if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
    echo "Uploaded: ${filename} (HTTP ${HTTP_CODE})"
  else
    echo "Failed: ${filename} (HTTP ${HTTP_CODE})"
    UPLOAD_OK=false
  fi
done

SCREENSHOT_FILES=$(ls "${SOURCE_DIR}"/*.png 2>/dev/null | xargs -I{} basename {} | tr '\n' ',' || echo "")
VIDEO_FILES=$(ls "${SOURCE_DIR}"/*.webm 2>/dev/null | xargs -I{} basename {} | tr '\n' ',' || echo "")

# has_media: 純粹判斷有無媒體檔（語意：是否需要發佈報告）
if [ -n "${SCREENSHOT_FILES}${VIDEO_FILES}" ]; then
  HAS_MEDIA=true
else
  HAS_MEDIA=false
fi

echo "screenshot_files=${SCREENSHOT_FILES}" >> "$GITHUB_OUTPUT"
echo "video_files=${VIDEO_FILES}" >> "$GITHUB_OUTPUT"
echo "media_url_prefix=${BUNNY_CDN_URL}/${MEDIA_PREFIX}" >> "$GITHUB_OUTPUT"
echo "has_media=${HAS_MEDIA}" >> "$GITHUB_OUTPUT"
echo "upload_ok=${UPLOAD_OK}" >> "$GITHUB_OUTPUT"
