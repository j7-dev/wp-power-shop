# Power Shop 規格文件

> 系統：Power Shop WordPress Plugin（WooCommerce 擴充後台）
> 版本：3.0.12
> 最後更新：2026-03

本目錄包含 Power Shop 的完整規格文件，採用 AIBDD Discovery 多視圖架構。

---

## 目錄結構

```
specs/
├── activities/              # Activity 視圖：業務流程
│   ├── order-management.activity
│   ├── product-management.activity
│   ├── customer-management.activity
│   └── dashboard-analytics.activity
├── features/                # Feature 視圖：Gherkin BDD 規格
│   ├── order/               # 訂單領域（6 個 Feature）
│   ├── product/             # 商品領域（5 個 Feature）
│   ├── customer/            # 顧客領域（5 個 Feature）
│   └── dashboard/           # 儀表板與分析領域（4 個 Feature）
├── ui/                      # UI 視圖：頁面規格
│   ├── dashboard.md
│   ├── order-list.md
│   ├── order-edit.md
│   ├── product-list.md
│   ├── product-edit.md
│   ├── product-taxonomies.md
│   ├── customer-list.md
│   ├── customer-edit.md
│   └── analytics.md
├── actors/                  # Actor 定義
│   └── shop-manager.md
├── api/                     # API 視圖：OpenAPI 3.0 規格
│   └── api.yml
└── entity/                  # Entity 視圖：DBML 資料模型
    └── erm.dbml
```

---

## 領域概覽

### 訂單管理 (Order)

| Feature | 類型 | 說明 |
|---------|------|------|
| [create-order](features/order/create-order.feature) | @command | 後台手動建立訂單 |
| [update-order-status](features/order/update-order-status.feature) | @command | 變更訂單狀態 |
| [edit-order-address](features/order/edit-order-address.feature) | @command | 修改帳單/運送地址 |
| [add-order-note](features/order/add-order-note.feature) | @command | 新增訂單備註 |
| [bulk-delete-orders](features/order/bulk-delete-orders.feature) | @command | 批量刪除訂單 |
| [query-order-list](features/order/query-order-list.feature) | @query | 查詢訂單列表 |

### 商品管理 (Product)

| Feature | 類型 | 說明 |
|---------|------|------|
| [create-draft-product](features/product/create-draft-product.feature) | @command | 快速建立草稿商品 |
| [save-product-data](features/product/save-product-data.feature) | @command | 儲存商品完整資料 |
| [generate-product-variations](features/product/generate-product-variations.feature) | @command | 自動生成變體 |
| [create-product-category](features/product/create-product-category.feature) | @command | 新增商品分類 |
| [query-product-list](features/product/query-product-list.feature) | @query | 查詢商品列表 |

### 顧客管理 (Customer)

| Feature | 類型 | 說明 |
|---------|------|------|
| [edit-customer-profile](features/customer/edit-customer-profile.feature) | @command | 編輯顧客基本資料 |
| [edit-customer-user-meta](features/customer/edit-customer-user-meta.feature) | @command | 編輯 UserMeta（高風險） |
| [add-customer-note](features/customer/add-customer-note.feature) | @command | 新增聯繫備註 |
| [query-customer-list](features/customer/query-customer-list.feature) | @query | 查詢顧客列表 |
| [query-customer-detail](features/customer/query-customer-detail.feature) | @query | 查詢顧客詳情 |

### 儀表板與分析 (Dashboard)

| Feature | 類型 | 說明 |
|---------|------|------|
| [query-dashboard-kpi](features/dashboard/query-dashboard-kpi.feature) | @query | KPI 統計（營收、新客、訂單） |
| [query-leaderboard](features/dashboard/query-leaderboard.feature) | @query | 商品/顧客排行榜 |
| [query-revenue-trend](features/dashboard/query-revenue-trend.feature) | @query | 營收趨勢圖表 |
| [query-revenue-analytics](features/dashboard/query-revenue-analytics.feature) | @query | 多維度營收分析 |

---

## 統計

| 類別 | 數量 |
|------|------|
| Activity 流程 | 4 |
| Feature 規格 | 20（12 @command + 8 @query） |
| UI 頁面規格 | 9 |
| Actor 定義 | 1 |
| API 端點 | 見 [api.yml](api/api.yml) |
| 資料表 | 9（見 [erm.dbml](entity/erm.dbml)） |
