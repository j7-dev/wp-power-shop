# 訂單編輯頁面

> 路由：`#/orders/edit/:id`

## 頁面說明

顯示單一訂單的完整資訊，支援更新狀態、編輯地址、新增備註等操作。

## 區塊配置

### 1. 訂單摘要列

| 欄位 | 說明 |
|------|------|
| 訂單編號 | 如 `#ORDER-001` |
| 建立日期 | ISO 8601 本地格式 |
| 狀態 | 可變更的下拉選單 |
| 付款方式 | 唯讀顯示 |

### 2. 帳單地址 / 運送地址

| 操作 | 說明 |
|------|------|
| 查看 | 格式化顯示完整地址 |
| 編輯 | 點擊「編輯」按鈕展開編輯表單 |
| 儲存 | 驗證後更新地址 |

- 帳單地址含 email 與 phone 欄位
- 運送地址不含 email 與 phone

### 3. 訂單項目

| 欄位 | 說明 |
|------|------|
| 商品名稱 | 含變體屬性 |
| SKU | 庫存管理單位 |
| 數量 | quantity |
| 小計 | subtotal |
| 合計 | total |

### 4. 訂單備註時間軸

- 顯示順序：最新在前（date_created DESC）
- 新增備註表單：
  - `note` 文字輸入框
  - `customer_note` 勾選框（「發送給顧客」）
  - 提交按鈕

## 資料來源

| 操作 | Feature 規格 |
|------|-------------|
| 更新狀態 | [update-order-status.feature](../features/order/update-order-status.feature) |
| 編輯地址 | [edit-order-address.feature](../features/order/edit-order-address.feature) |
| 新增備註 | [add-order-note.feature](../features/order/add-order-note.feature) |
