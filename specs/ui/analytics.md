# 營收分析頁面

> 路由：`#/analytics`

## 頁面說明

多維度營收分析頁面，支援自訂日期範圍、統計區間、商品篩選，提供當期與去年同期的 YoY 比較。

## 區塊配置

### 1. 篩選列

| 篩選器 | 類型 | 說明 |
|--------|------|------|
| 日期範圍 | RangePicker | date_from ~ date_to（最長 1 年） |
| 統計區間 | Select | day / week / month |
| 商品篩選 | Select (多選) | 依 product_ids 篩選（可選） |

### 2. 摘要指標

| 指標 | 說明 | YoY 比較 |
|------|------|---------|
| 總營收 (Gross) | totals.gross_revenue | 正增長=綠，負增長=紅 |
| 淨營收 (Net) | totals.net_revenue | 同上 |
| 訂單數 | totals.orders_count | 同上 |
| 平均訂單金額 | totals.avg_order_value | 同上 |
| 售出件數 | totals.num_items_sold | 同上 |

- 無去年同期資料時 YoY% 顯示 `N/A`

### 3. 時序趨勢圖

- 圖表類型：ECharts 柱狀圖 + 折線圖
- X 軸：依 interval 分組的時間區間
- 柱狀：當期 gross_revenue
- 折線：去年同期 gross_revenue（灰色虛線）
- Tooltip：同時顯示當期與去年同期數據

### 4. 時序資料表格

| 欄位 | 說明 |
|------|------|
| 區間 | date_start ~ date_end |
| 總營收 | gross_revenue |
| 訂單數 | orders_count |
| YoY% | 與去年同期比較的百分比 |

## 資料來源

| 操作 | Feature 規格 |
|------|-------------|
| 營收分析 | [query-revenue-analytics.feature](../features/dashboard/query-revenue-analytics.feature) |
