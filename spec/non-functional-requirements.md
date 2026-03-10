# 非功能需求規格

> **文件版本**：1.0
> **最後更新**：2025-03
> **適用範圍**：Power Shop Plugin 全系統

---

## 目錄

- [NFR-01 效能（Performance）](#nfr-01-效能-performance)
- [NFR-02 安全性（Security）](#nfr-02-安全性-security)
- [NFR-03 相容性（Compatibility）](#nfr-03-相容性-compatibility)
- [NFR-04 可維護性（Maintainability）](#nfr-04-可維護性-maintainability)
- [NFR-05 可用性（Usability）](#nfr-05-可用性-usability)
- [NFR-06 可靠性（Reliability）](#nfr-06-可靠性-reliability)
- [NFR-07 擴充性（Scalability）](#nfr-07-擴充性-scalability)
- [NFR-08 國際化與在地化（i18n / L10n）](#nfr-08-國際化與在地化-i18n--l10n)

---

## NFR-01 效能（Performance）

| ID | 需求描述 | 量化指標 |
|----|---------|---------|
| NFR-01-1 | Dashboard KPI 卡片應在首次載入後快速呈現資料 | API 回應時間 ≤ 500ms（P95，資料量 ≤ 10,000 筆訂單） |
| NFR-01-2 | 商品列表、訂單列表、顧客列表頁面切換應流暢 | 頁面內資料切換 ≤ 300ms（前端快取命中） |
| NFR-01-3 | React SPA 初始載入包應進行 Code Splitting 與 Tree Shaking | 初始 JS Bundle（gzip 後）≤ 500KB |
| NFR-01-4 | 圖片資源應透過 WordPress 媒體庫提供適當尺寸，避免載入過大圖檔 | 商品列表縮圖解析度 ≤ 300×300px |
| NFR-01-5 | 所有 API 請求應使用 HTTP 快取標頭（`Cache-Control`、`ETag`），避免重複拉取靜態資料 | 相同資料的重複請求 Cache Hit Rate ≥ 80% |
| NFR-01-6 | 營收分析圖表資料量超過 365 個資料點時，前端應進行資料降採樣（Downsampling） | 渲染時間 ≤ 1s（1 年日統計資料） |

---

## NFR-02 安全性（Security）

| ID | 需求描述 | 實作要求 |
|----|---------|---------|
| NFR-02-1 | 所有後台頁面存取應透過 WordPress 能力檢查（`current_user_can`） | 使用 `manage_woocommerce` 能力 |
| NFR-02-2 | 所有自有 REST API 端點應驗證 **WP Nonce** 或使用 Cookie Auth | 呼叫 `check_ajax_referer` 或 `WP_REST_Request` 內建驗證 |
| NFR-02-3 | 前端傳遞至 PHP 的設定值（REST URL、Nonce）應透過 **SimpleEncrypt** 加密 | 禁止在 HTML 原始碼中明文暴露 Nonce |
| NFR-02-4 | 所有資料庫查詢應使用 **prepared statements**（`$wpdb->prepare`） | 禁止使用字串拼接 SQL |
| NFR-02-5 | 所有輸出至 HTML 的字串應進行 **Escaping**（`esc_html`、`esc_attr`、`wp_kses`） | XSS 防護 |
| NFR-02-6 | User Meta 編輯功能（危險操作）應實作**雙重確認機制** | 需要二次確認對話框 + 重新輸入密碼或確認碼 |
| NFR-02-7 | Plugin 應遵循 **WordPress Plugin Security Review** 標準 | 通過 PHPCS Security 規則集掃描 |
| NFR-02-8 | 前端 build 產出物不得包含任何 API 金鑰、密碼或敏感憑證 | CI/CD 需包含 secret scanning |

---

## NFR-03 相容性（Compatibility）

| ID | 需求描述 | 量化指標/版本要求 |
|----|---------|----------------|
| NFR-03-1 | 支援 **WordPress** 最新兩個主要版本 | WP 6.3+ |
| NFR-03-2 | 支援 **WooCommerce** 最新兩個主要版本 | WC 8.0+ |
| NFR-03-3 | 後端支援 **PHP** 8.0 以上版本 | PHP 8.0 / 8.1 / 8.2 / 8.3 |
| NFR-03-4 | 前端支援主流瀏覽器最新兩個版本 | Chrome / Firefox / Safari / Edge |
| NFR-03-5 | 後台 UI 應在 **1280px 以上**解析度正常顯示（管理者通常使用桌機） | 不需支援 ≤ 768px |
| NFR-03-6 | Plugin 不應與 WooCommerce Subscriptions、WooCommerce Shipping 等常用官方擴充產生衝突 | 回歸測試清單涵蓋前 10 大常用擴充 |
| NFR-03-7 | REST API 應相容 **WooCommerce REST API v3** 規格 | 不得修改 WooCommerce 原生 API 回應結構 |

---

## NFR-04 可維護性（Maintainability）

| ID | 需求描述 | 實作要求 |
|----|---------|---------|
| NFR-04-1 | PHP 代碼應遵循 **WordPress Coding Standards（WPCS）** | 透過 `phpcs.xml` 設定，CI 自動檢查 |
| NFR-04-2 | PHP 代碼應通過 **PHPStan Level 5** 靜態分析 | `phpstan.neon` 設定，CI 自動執行 |
| NFR-04-3 | TypeScript 嚴格模式應全程啟用 | `tsconfig.json` 中 `"strict": true` |
| NFR-04-4 | 所有 PHP class 應使用 `J7\PowerShop` namespace，避免全域污染 | 禁止使用無 namespace 的全域 function（公用函式除外） |
| NFR-04-5 | 所有 PHP class 應採用 **SingletonTrait + final class** 模式 | 確保單一實例，防止重複初始化 |
| NFR-04-6 | React 元件應依模組拆分於對應目錄下，每個元件單一職責 | 元件行數原則上 ≤ 200 行 |
| NFR-04-7 | 共用邏輯應提取為 Custom Hooks 或 Utility 函式，避免重複代碼 | DRY 原則 |
| NFR-04-8 | API 層應統一透過 Refine.dev Data Provider 呼叫，不直接在元件內使用 `fetch` | 維持資料層一致性 |
| NFR-04-9 | 版本號應遵循 **Semantic Versioning（SemVer）** 規範 | `MAJOR.MINOR.PATCH` |

---

## NFR-05 可用性（Usability）

| ID | 需求描述 | 量化指標/說明 |
|----|---------|-------------|
| NFR-05-1 | 操作回饋：所有 Create / Update / Delete 操作應在完成後顯示**成功或失敗的 Toast 通知** | Ant Design `message` 或 `notification` 元件 |
| NFR-05-2 | 破壞性操作（批量刪除、刪除商品、刪除顧客備註等）應顯示**確認對話框** | Ant Design `Modal.confirm` |
| NFR-05-3 | 表單驗證錯誤應以**行內錯誤訊息**即時呈現，不需提交後才顯示 | 使用 Ant Design Form 的 `validator` |
| NFR-05-4 | 長時間操作（API 請求 > 300ms）應顯示**載入狀態**（Skeleton / Spinner） | 防止使用者誤以為系統無回應 |
| NFR-05-5 | 商品/訂單/顧客的**麵包屑導航**應清楚呈現當前位置 | 返回列表的路徑不得超過 2 步 |
| NFR-05-6 | 後台介面文字應使用**繁體中文**（台灣用語） | 所有 UI label、錯誤訊息、說明文字均為繁體中文 |
| NFR-05-7 | 拖拉排序（屬性、分類）應提供視覺拖曳提示（游標變更、拖曳陰影） | 使用 `@dnd-kit` 相關元件 |

---

## NFR-06 可靠性（Reliability）

| ID | 需求描述 | 量化指標/說明 |
|----|---------|-------------|
| NFR-06-1 | API 請求失敗時，前端應顯示**友善錯誤訊息**，而非空白頁或 JS 錯誤 | 使用 Refine.dev 的 `errorBoundary` 機制 |
| NFR-06-2 | React 渲染錯誤應透過 **Error Boundary** 攔截，顯示降級 UI | 防止整個 SPA 崩潰 |
| NFR-06-3 | 訂單/商品的儲存操作應為**原子性**：成功才更新 UI 狀態，失敗則保留原始資料 | 樂觀更新需有回滾機制 |
| NFR-06-4 | Plugin 啟用時應檢查 WooCommerce 是否已安裝，若未安裝應顯示警告並停用 | 使用 `is_plugin_active('woocommerce/woocommerce.php')` |

---

## NFR-07 擴充性（Scalability）

| ID | 需求描述 | 說明 |
|----|---------|------|
| NFR-07-1 | 前端 Data Provider 架構應支援未來新增第三方 API 來源（如 ERP、物流系統） | 目前有 6 個 DataProvider，架構需支援橫向擴充 |
| NFR-07-2 | 後端 API 模組應基於 `ApiBase` 類別擴充，確保一致的路由註冊與權限控管 | 新增 API 只需繼承 `ApiBase` |
| NFR-07-3 | 功能模組應保持低耦合，單一模組的變更不應影響其他模組 | 遵循單一職責原則（SRP） |

---

## NFR-08 國際化與在地化（i18n / L10n）

| ID | 需求描述 | 說明 |
|----|---------|------|
| NFR-08-1 | 所有 PHP 輸出字串應使用 WordPress i18n 函式包裝（`__()`, `_e()`, `_n()`） | Text Domain: `power-shop` |
| NFR-08-2 | 前端字串應支援 `wp.i18n` 或對應的 React i18n 機制 | 為未來多語系支援預留架構 |
| NFR-08-3 | 貨幣格式應根據 WooCommerce 系統設定（貨幣符號、小數位數、千分位）動態調整 | 不得寫死 `NT$` 或其他貨幣符號 |
| NFR-08-4 | 日期時間顯示應依據 WordPress 時區設定，並以當地格式呈現 | 使用 `wp_timezone()` 取得設定時區 |
