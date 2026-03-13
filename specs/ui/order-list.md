# 訂單列表頁面

> 路由：`#/orders`

## 頁面說明

顯示所有訂單的分頁列表，支援狀態篩選、關鍵字搜尋與排序，提供建立訂單與批量刪除功能。

## 功能區塊

### 1. 操作列

| 元素 | 類型 | 說明 |
|------|------|------|
| 建立訂單 | Button | 開啟建立訂單表單 |
| 批量刪除 | Button (danger) | 勾選訂單後出現，點擊需通過確認對話框 |

### 2. 篩選列

| 篩選器 | 類型 | 選項 |
|--------|------|------|
| 狀態篩選 | Select | pending / processing / on-hold / completed / cancelled / refunded / failed |
| 關鍵字搜尋 | Search Input | 搜尋訂單編號 |

### 3. 訂單表格

| 欄位 | 寬度 | 排序 | 說明 |
|------|------|------|------|
| 勾選框 | 50px | - | 用於批量操作 |
| 訂單編號 | 120px | id | 可點擊進入編輯頁 |
| 狀態 | 100px | - | Tag 顏色區分 |
| 顧客 | 150px | - | 顧客名稱 |
| 總金額 | 120px | - | 含千分位格式 |
| 建立日期 | 150px | date | 本地時間格式 |
| 操作 | 80px | - | 編輯按鈕 |

- 預設排序：`id` DESC
- 分頁：10 / 25 / 50 筆/頁

## 資料來源

| 操作 | Feature 規格 |
|------|-------------|
| 查詢列表 | [query-order-list.feature](../features/order/query-order-list.feature) |
| 建立訂單 | [create-order.feature](../features/order/create-order.feature) |
| 批量刪除 | [bulk-delete-orders.feature](../features/order/bulk-delete-orders.feature) |
