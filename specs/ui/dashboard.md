# Dashboard 頁面

> 路由：`#/dashboard`

## 頁面說明

Power Shop 後台首頁，提供電商關鍵指標的即時概覽。管理者進入後台時的第一個畫面。

## 區塊配置

### 1. KPI 卡片列

| 卡片名稱 | 數值來源 | 顯示格式 | 附加資訊 |
|----------|---------|---------|---------|
| 總營收 | `current.revenue` | 金額（含千分位） | 環比 `change.revenue_pct` |
| 新顧客數 | `current.new_customers` | 整數 + CountUp 動畫 | 環比 `change.new_customers_pct` |
| 未付款訂單 | `current.pending_orders` | 整數 | 環比 `change.pending_orders_pct` |
| 未出貨訂單 | `current.processing_orders` | 整數 | 環比 `change.processing_orders_pct` |

- 環比正增長顯示綠色上箭頭，負增長顯示紅色下箭頭
- 支援切換查詢期間：today / week / month / year

### 2. 營收趨勢圖表

- 圖表類型：ECharts 面積折線圖
- X 軸：時間（依 interval 分組）
- Y 軸（左）：營收金額
- Y 軸（右）：訂單數
- 額外圖層：去年同期資料（灰色虛線）
- 互動：切換 interval（日/週/月/年）

### 3. 排行榜

| Tab | 資料來源 | 排序 | 顯示上限 |
|-----|---------|------|---------|
| 暢銷商品 | `type=product` | `total` DESC | 5 筆 |
| 高消費顧客 | `type=customer` | `total` DESC | 5 筆 |

- 每筆顯示：排名、名稱、數量、金額
- 日期範圍與 KPI 卡片同步

## 資料來源

| 資料 | API 端點 | Feature 規格 |
|------|---------|-------------|
| KPI 統計 | `GET /power-shop/reports/dashboard/stats` | [query-dashboard-kpi.feature](../features/dashboard/query-dashboard-kpi.feature) |
| 排行榜 | `GET /power-shop/reports/dashboard/stats` | [query-leaderboard.feature](../features/dashboard/query-leaderboard.feature) |
| 營收趨勢 | `GET /wc/v3/reports/revenue/stats` | [query-revenue-trend.feature](../features/dashboard/query-revenue-trend.feature) |
