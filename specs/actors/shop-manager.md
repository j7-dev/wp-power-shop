# 店舖管理者 (Shop Manager)

## 角色定義

具有 WordPress `manage_woocommerce` 能力（capability）的後台使用者，涵蓋以下操作角色：

| 角色名稱 | 職責說明 |
|----------|---------|
| 電商管理者 | 負責整體電商運營策略、商品上架規劃與業績追蹤 |
| 客服人員 | 處理訂單狀態更新、顧客資料維護與聯繫記錄管理 |
| 商品管理人員 | 負責商品資料建立、編輯、分類管理與變體設定 |
| 倉管人員 | 追蹤訂單出貨進度、庫存狀態管理 |

## 存取權限

- 必須通過 WordPress Cookie + X-WP-Nonce 認證
- 必須擁有 `manage_woocommerce` capability
- 所有操作限於 Power Shop 後台介面（WP Admin 內的 SPA）

## 業務流程參與

| 流程 | 參與方式 |
|------|---------|
| [訂單管理](../activities/order-management.activity) | 建立、更新、備註、刪除訂單 |
| [商品管理](../activities/product-management.activity) | 建立、編輯商品與分類、生成變體 |
| [顧客管理](../activities/customer-management.activity) | 編輯顧客資料、管理聯繫備註 |
| [儀表板與分析](../activities/dashboard-analytics.activity) | 查看 KPI、排行榜、營收趨勢與分析 |
