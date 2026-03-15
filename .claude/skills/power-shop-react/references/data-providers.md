# Power Shop — Data Provider 設定與使用方式

> Power Shop 前端配置了 6 個 Refine Data Provider，每個對應不同的 API 來源。

---

## 6 個 Data Provider

### 1. `'default'` — Powerhouse Core

- **來源：** `antd-toolkit/refine` 的 `dataProvider`
- **用途：** Powerhouse 平台核心資源（posts、media 等）
- **API Base：** 由 `antd-toolkit` 自動配置

```tsx
const { data } = useList({
  resource: 'posts',
  // dataProviderName 不指定時使用 default
})
```

### 2. `'wc-rest'` — WooCommerce REST v3

- **來源：** `antd-toolkit/wp` 的 `wcRestDataProvider`
- **用途：** WooCommerce products、orders、customers
- **API Base：** `/wp-json/wc/v3/`
- **Headers：** 自動附加 `X-WP-Nonce`

```tsx
const { tableProps } = useTable({
  resource: 'products',
  dataProviderName: 'wc-rest',
})

const { formProps } = useForm({
  resource: 'orders',
  action: 'edit',
  id: orderId,
  dataProviderName: 'wc-rest',
})
```

### 3. `'wc-store'` — WooCommerce Store API

- **來源：** `antd-toolkit/wp` 的 `wcStoreDataProvider`
- **用途：** 前台商店功能（cart、checkout）
- **API Base：** `/wp-json/wc/store/v1/`

```tsx
const { data: cart } = useCustom({
  url: `${storeApiUrl}/cart`,
  method: 'get',
  dataProviderName: 'wc-store',
})
```

### 4. `'power-shop'` — 自有 REST API

- **來源：** `antd-toolkit/refine` 的 `dataProvider`（自訂 apiUrl）
- **用途：** Dashboard 統計、Analytics 報表、顧客備註
- **API Base：** `/wp-json/power-shop/`

```tsx
const apiUrl = useApiUrl('power-shop')
const { data } = useCustom<TDashboardStats>({
  url: `${apiUrl}/reports/dashboard/stats`,
  method: 'get',
  config: { query: { period: 'month' } },
  dataProviderName: 'power-shop',
})
```

### 5. `'wp-rest'` — WordPress REST API v2

- **來源：** `antd-toolkit/wp` 的 `wpRestDataProvider`
- **用途：** WordPress users、UserMeta
- **API Base：** `/wp-json/wp/v2/`

```tsx
const { mutate } = useUpdate({
  resource: 'users',
  dataProviderName: 'wp-rest',
})
mutate({ id: userId, values: { meta: { custom_key: 'value' } } })
```

### 6. `'bunny-stream'` — Bunny.net Video

- **來源：** `antd-toolkit/refine` 的 `bunnyStreamDataProvider`
- **用途：** 影片上傳、管理、播放
- **API Base：** Bunny.net API

```tsx
const { data } = useList({
  resource: 'videos',
  dataProviderName: 'bunny-stream',
})
```

---

## 使用規則

1. **永遠明確指定** `dataProviderName`（除了 `default`）。
2. **禁止直接使用** `fetch` 或 `axios` — 使用 Refine hooks。
3. 使用 `useApiUrl(providerKey)` 取得對應的 API base URL。
4. 透過 `useCustom` 呼叫非 CRUD 端點（如 Dashboard stats）。
5. 透過 `useTable`、`useForm`、`useList` 等處理標準 CRUD。

---

## Provider 設定位置

Data Provider 設定在 `js/src/App1.tsx` 的 `<Refine>` 元件中：

```tsx
import { dataProvider } from 'antd-toolkit/refine'

<Refine
  dataProvider={{
    default: dataProvider(`${API_URL}/v2/powerhouse`, AXIOS_INSTANCE),
    'wp-rest': dataProvider(`${API_URL}/wp/v2`, AXIOS_INSTANCE),
    'wc-rest': dataProvider(`${API_URL}/wc/v3`, AXIOS_INSTANCE),
    'wc-store': dataProvider(`${API_URL}/wc/store/v1`, AXIOS_INSTANCE),
    'bunny-stream': bunny_data_provider_result,
    'power-shop': dataProvider(`${API_URL}/${KEBAB}`, AXIOS_INSTANCE),
  }}
  // ...
>
```

所有 provider（bunny-stream 除外）都使用 `antd-toolkit/refine` 的 `dataProvider()` 工廠函式，傳入不同的 API base URL 和共用的 AXIOS_INSTANCE。
