# 顧客列表頁面

> 路由：`#/users`

## 頁面說明

顯示所有顧客的分頁列表，支援關鍵字搜尋（姓名/Email）與角色篩選。

## 功能區塊

### 1. 篩選列

| 篩選器 | 類型 | 說明 |
|--------|------|------|
| 關鍵字搜尋 | Search Input | 搜尋姓名或 Email |
| 角色篩選 | Select | WordPress 角色（如 customer） |

### 2. 顧客表格

| 欄位 | 寬度 | 說明 |
|------|------|------|
| 頭像 | 40px | Gravatar 頭像 |
| 姓名 | auto | first_name + last_name，可點擊進入詳情 |
| Email | 200px | - |
| 訂單數 | 80px | orders_count |
| 總消費 | 120px | total_spent，含千分位格式 |
| 註冊日期 | 150px | date_created |

- 分頁：10 / 25 / 50 筆/頁

## 資料來源

| 操作 | Feature 規格 |
|------|-------------|
| 查詢列表 | [query-customer-list.feature](../features/customer/query-customer-list.feature) |
