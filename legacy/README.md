# Power Shop | 讓你的商店充滿 Power 🚀

一句話講完快速商店:

> Power Shop 是一個 WordPress 套件，安裝後，可以讓你的 Woocommerce 商店變成可以提供給多人使用的一頁商店，並且可以讓使用者自訂商品的價格，以及統計每個一頁商店的訂單狀態與銷售額

<br><br><br>

## 🎮 範例網站

[測試商店](https://fs.yc-tech.co/power-shop/j7/)

管理員帳密請私訊作者索取

<br><br><br>

## ⚡ 主要功能

1. 創建多個一頁商店<br>
   每個商店就如同頁面一樣，可以搭配你自己喜歡的頁面編輯器(如: Elementor)，每個頁面，需要插入後台提供的短代碼`[power_shop_products]` 你可以自訂商品應該要出現在頁面的哪裡

2. 隨你喜好，任你挑選<br>
   在快速商店裡面，可以隨意挑選你想要的商品<br>
   <img src="https://github.com/zenbuapps/power-shop.wp-plugin/assets/9213776/a03a2fd0-813c-4cfa-977a-cdc14b773eb5" />

3. 自訂商品的價格<br>
   挑選完商品，你可以看到每個商品的預設價格，但你可以自己決定自己挑選的商品要賣多少<br>
   <img src="https://github.com/zenbuapps/power-shop.wp-plugin/assets/9213776/861903f9-2238-474c-9c82-cd65a1d57c6c" />

4. 更流暢的購物車<br>
   使用 "樂觀變更" (optimistic mutate) 即，畫面 UI 先更新，再發送請求，而不是等待請求回傳後再更新畫面，這樣可以讓使用者的購物體驗更加流暢<br>
   購物車使用 Woocommerce Store API 以及 ajax 實作，讓使用者的購物體驗更加流暢<br>

5. 統計每一個快速商店的訂單<br>
   每一筆訂單都會紀錄是由哪一個快速商店產生的，在每一頁快速商店頁面底下也會統計近期的銷售與訂單狀態，方便統計分潤<br>
   <img src="https://github.com/zenbuapps/power-shop.wp-plugin/assets/9213776/b3887d76-ac1d-40f1-bbeb-03bc7814db64" />

<br><br><br>

## 🐞 Bug 回報

請參考 [BUG 回報規範](https://doc.clickup.com/9009088049/d/h/8cfqhhh-520/f1f334803b7a672/8cfqhhh-860)

<br><br><br>

## 🗺️ 開發 RoadMap

🔲 Excel 訂單下載

🔲 Coupon 支援

🔲 多語系


<br><br><br>

## 💻 開發使用技術

#### 前端

1. [Vite](https://vitejs.dev/) - build tool
2. [React v18](https://beta.reactjs.org/)
3. [TypeScript](https://www.typescriptlang.org/docs/) - compile project with type safe
4. [Tailwind v3](https://tailwindcss.com/) - you can install any UI library, like Ant Design, MUI, Chakra...etc
5. [SCSS](https://sass-lang.com/documentation/syntax)
6. [React Query v4](https://tanstack.com/query/v4) - managing API status
7. [React Router v6](https://reactrouter.com/en/main) - front-end router
8. [Ant Design v5](https://ant.design/) - UI Library

#### 後端

1. [usefulteam/jwt-auth](https://github.com/usefulteam/jwt-auth) - get JWT if a wordpress user is logged in
2. [lodash-php/lodash-php](https://github.com/lodash-php/lodash-php) - easy to use utility functions for PHP
3. [vlucas/phpdotenv](https://github.com/vlucas/phpdotenv) - loads environment variables from `.env`

<br><br><br>




## ⬇️ 安裝方式

請至 release 下載安裝檔案，之後如同一般 WordPress 套件安裝即可
