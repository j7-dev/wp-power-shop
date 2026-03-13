# 商品分類管理頁面

> 路由：`#/products/taxonomies`

## 頁面說明

以可拖拉排序的樹狀結構（SortableTree）管理 WooCommerce 商品分類（product_cat），支援新增、階層嵌套。

## 功能區塊

### 1. 操作列

| 元素 | 類型 | 說明 |
|------|------|------|
| 新增分類 | Button | 開啟新增分類表單 |

### 2. 新增分類表單

| 欄位 | 類型 | 說明 |
|------|------|------|
| name | Input | 分類名稱（必填） |
| slug | Input | URL 別名（自動從 name 生成） |
| parent | TreeSelect | 父分類（可選，0=頂層） |
| description | TextArea | 分類描述 |
| image | ImageUpload | 分類縮圖 |

### 3. 分類樹

- 元件：Ant Design Tree + 拖拉排序
- 每個節點顯示：name、count（所屬商品數）
- 支援拖拉調整排序（menu_order）
- 支援無限層級（建議不超過 3 層）

## 資料來源

| 操作 | Feature 規格 |
|------|-------------|
| 新增分類 | [create-product-category.feature](../features/product/create-product-category.feature) |
