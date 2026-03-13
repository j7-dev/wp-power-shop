# 顧客編輯頁面

> 路由：`#/users/edit/:id`

## 頁面說明

顯示單一顧客的完整資料，包含基本資訊、地址、User Meta、購物車、近期訂單與聯繫備註。

## 區塊配置

### 1. 顧客基本資訊

| 欄位 | 類型 | 說明 |
|------|------|------|
| first_name | Input | 名字 |
| last_name | Input | 姓氏 |
| email | Input | Email（唯一，驗證格式） |
| phone | Input | 電話 |
| role | Display | WordPress 角色（唯讀） |
| orders_count | Display | 訂單總數（唯讀統計） |
| total_spent | Display | 總消費金額（唯讀統計） |

### 2. 帳單地址 / 運送地址

- 與訂單地址格式相同
- 支援編輯模式切換

### 3. User Meta

| 功能 | 說明 |
|------|------|
| 瀏覽 | 以 key-value 表格顯示所有 meta_data |
| 編輯 | 點擊「編輯」後需通過**雙重確認**對話框 |
| 警示 | 高風險操作提示：「直接修改 User Meta 可能影響系統行為」 |

### 4. 近期訂單

| 欄位 | 說明 |
|------|------|
| 訂單編號 | 可點擊跳轉至訂單編輯頁 |
| 狀態 | Tag 顯示 |
| 金額 | total |
| 日期 | date_created |

- 最多顯示 10 筆，按 date_created DESC

### 5. 聯繫備註時間軸

- 顯示順序：最新在前（date_created DESC）
- 每筆顯示：content、author_name、date_created
- 新增備註表單：content 文字輸入框 + 提交按鈕

### 6. 購物車內容

- 顯示顧客目前購物車中的商品
- 購物車為空時顯示空狀態提示

## 資料來源

| 操作 | Feature 規格 |
|------|-------------|
| 查詢詳情 | [query-customer-detail.feature](../features/customer/query-customer-detail.feature) |
| 編輯資料 | [edit-customer-profile.feature](../features/customer/edit-customer-profile.feature) |
| 編輯 Meta | [edit-customer-user-meta.feature](../features/customer/edit-customer-user-meta.feature) |
| 新增備註 | [add-customer-note.feature](../features/customer/add-customer-note.feature) |
