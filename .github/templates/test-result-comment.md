<!--
  用途：自動化測試（Playwright E2E）結果 Issue Comment
  使用方式：JS 端用 fs.readFileSync 讀取後，renderTemplate() 替換佔位符

  佔位符清單：
    {{STATUS_EMOJI}}       - ✅ 或 ❌
    {{STATUS_TEXT}}         - 通過 或 失敗
    {{AGENT_SUFFIX}}       - Agent 名稱後綴（如 " — agent-name"，可為空）
    {{FIX_INFO}}           - 修復資訊（含前導換行與 > 前綴，可為空）
    {{SUMMARY_TABLE}}      - 測試統計表（含標題，可為空）
    {{TEST_OUTPUT}}        - 測試輸出文字
    {{CYCLE}}              - 測試循環次數

  條件區塊：無（所有條件邏輯由 JS 端預處理後插入對應佔位符）
-->
## {{STATUS_EMOJI}} 自動化測試{{STATUS_TEXT}}{{AGENT_SUFFIX}}
{{FIX_INFO}}
{{SUMMARY_TABLE}}
<details>
<summary>📋 測試輸出（點擊展開）</summary>

```
{{TEST_OUTPUT}}
```

</details>

---
*🤖 測試在 Claude Code 開發完成後自動執行（cycle {{CYCLE}}/3）*
