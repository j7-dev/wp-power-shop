# Power Shop — 規格文件索引

> **專案**：Power Shop WordPress Plugin（WooCommerce 擴充）
> **語言**：繁體中文
> **最後更新**：2025-03

## 目錄結構

| 文件 | 說明 |
|------|------|
| [Event Storming](./es.md) | Actor、Aggregate、Command、Read Model 業務流程規格 |
| [功能需求](./functional-requirements.md) | 6 大模組的完整功能需求清單 |
| [非功能需求](./non-functional-requirements.md) | 效能、安全性、相容性、可維護性等品質屬性 |
| [使用者故事](./user-stories.md) | 以使用者角度描述的故事與驗收標準（Gherkin 風格） |
| [API 規格](./api-spec.md) | REST API 端點、請求/回應結構、錯誤碼 |
| [實體模型](./entity-model.md) | 核心領域實體、欄位定義、關聯圖 |

## 專案概述

Power Shop 是一套以 **React SPA** 取代 WooCommerce 預設後台介面的 WordPress Plugin，目標使用者為台灣的 WordPress / WooCommerce 電商網站管理者。

### 技術棧

**後端**
- PHP 8.0+ / WordPress 6.x / WooCommerce 8.x
- Namespace：`J7\PowerShop`
- 架構：`SingletonTrait` + `final class` + `ApiBase`

**前端**
- React 18 / TypeScript / Vite（port 5178）
- Refine.dev（CRUD 框架）/ Ant Design v5
- Jotai（跨分頁狀態）/ HashRouter

### 核心模組

1. **Dashboard** — KPI 卡片、排行榜、營收趨勢圖表
2. **訂單管理** — 列表、編輯、快速建立
3. **商品管理** — 多 Tab 編輯、分類/標籤/規格管理
4. **顧客管理** — 列表、詳細檔案、聯繫備註
5. **營收分析** — 多圖表視圖、趨勢指標、同期比較
6. **媒體庫** — WordPress 媒體庫整合
