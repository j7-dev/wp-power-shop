# Power Shop — 商品編輯器系統

> 詳述商品編輯頁的多 Tab 系統、partials 機制與虛擬表格模式。

---

## 多 Tab 架構

商品編輯頁位於 `js/src/pages/admin/Product/Edit/index.tsx`，包含 8 個 Tab：

| Tab 名稱 | Partials | 說明 |
|----------|----------|------|
| 描述 | `basic`, `detail` | 商品名稱、描述、短描述 |
| 價格 | `price` | 原價、特價、促銷日期 |
| 庫存 | `stock` | SKU、庫存數量、庫存狀態 |
| 規格 | `attribute` | 商品屬性管理 |
| 變體 | `variation` | 變體列表、批次操作 |
| 進階 | `sales`, `size`, `subscription` | 購買備註、排序、尺寸、訂閱 |
| 關聯 | `taxonomy` | 分類、標籤、交叉銷售、向上銷售 |
| 分析 | - | 單品銷售分析圖表 |

---

## Partials 機制

使用 `queryMeta.variables.partials` 向 API 請求特定資料切片，避免不必要的資料傳輸：

```tsx
const { formProps, saveButtonProps, query, onFinish } = useForm<TProductRecord>({
  action: 'edit',
  resource: 'products',
  id,
  dataProviderName: 'wc-rest',
  queryMeta: {
    variables: {
      partials: ['basic', 'detail', 'price', 'stock', 'taxonomy'],
      meta_keys: [],
    },
  },
})
```

### 可用 Partials

| Partial | 包含欄位 |
|---------|----------|
| `basic` | name、slug、type、status、featured、images |
| `detail` | description、short_description、purchase_note |
| `price` | regular_price、sale_price、date_on_sale_from/to |
| `stock` | sku、gtin、manage_stock、stock_quantity、stock_status、backorders |
| `sales` | menu_order、reviews_allowed、external_url、button_text |
| `size` | weight、dimensions |
| `subscription` | 訂閱相關欄位 |
| `taxonomy` | categories、tags、upsell_ids、cross_sell_ids、grouped_products |
| `attribute` | attributes（屬性定義） |
| `variation` | variations（變體 ID 列表） |

---

## 產品類型條件

UI 根據 WooCommerce 產品類型顯示/隱藏元素：

| 條件 | 檢查方式 | 適用類型 |
|------|----------|----------|
| 顯示變體 Tab | `isVariable(watchProductType)` | `variable`、`subscription_variable` |
| 隱藏價格 Tab | 類型檢查 | `grouped`、`variable` |
| 停用儲存按鈕 | 目前 Tab 檢查 | 所有類型（Tab = Attributes/Variation/Analytics） |

### isVariable 函式

來自 `antd-toolkit/wp`：

```tsx
import { isVariable } from 'antd-toolkit/wp'

// 檢查是否為可變商品
if (isVariable(productType)) {
  // 顯示變體相關 UI
}
```

---

## 虛擬表格模式

### 問題背景

ProductEditTable（變體編輯表格）使用虛擬列表渲染大量變體，但 Ant Design `Form.getFieldsValue` 不適用於虛擬列表（未渲染的行沒有表單實例）。

### 解決方案

```
表格編輯
  → handleValuesChange       # 攔截表單值變更
    → setVirtualFields       # 更新手動管理的狀態
      → 繞過 Form 直接管理資料

同步模式
  → 開啟同步模式
    → 批次更新所有變體的相同欄位
      → 一次性發送 batch API 請求
```

### 關鍵 Hook

```tsx
// 虛擬表格狀態管理
const [virtualFields, setVirtualFields] = useState<Record<number, Partial<TVariation>>>({})

const handleValuesChange = (changedValues: any, allValues: any) => {
  // 手動追蹤變更，因為虛擬列表中未渲染的行不在 Form 中
  setVirtualFields(prev => ({ ...prev, ...changedValues }))
}
```

---

## 變體批次操作

變體使用 WooCommerce batch API 進行批次建立/更新/刪除：

```tsx
// 自動生成所有變體（笛卡爾積）
const { mutate: batchCreate } = useCustom({
  url: `${apiUrl}/products/${productId}/variations/batch`,
  method: 'post',
  dataProviderName: 'wc-rest',
})

batchCreate({
  values: {
    create: newVariations,  // 新建
    update: changedVariations, // 更新
    delete: deletedIds,     // 刪除
  },
})
```

---

## 商品屬性管理

商品屬性（attributes）用於定義變體的維度：

```tsx
// 屬性結構
interface ProductAttribute {
  id: number      // 0 = 自訂屬性，>0 = 全域屬性
  name: string    // 屬性名稱（如「顏色」「尺寸」）
  position: number
  visible: boolean
  variation: boolean  // true = 用於變體
  options: string[]   // 選項值（如 ['紅', '藍', '綠']）
}
```

- `variation: true` 的屬性會用於生成變體組合
- 全域屬性在 `/products/attributes` 頁面管理
- 商品層級可覆蓋全域屬性的選項
