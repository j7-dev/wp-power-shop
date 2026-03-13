@ignore @command
Feature: 儲存商品資料

  店舖管理者將商品編輯頁面所有 Tab（描述、價格、庫存、規格、進階、關聯）的資料儲存至 WooCommerce，
  用於更新商品的完整資訊，維護準確的商品上架資料。

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下商品
      | id | name        | status |
      | 1  | MacBook Pro | draft  |

  Rule: 前置（狀態）- 指定的商品 id 必須存在於系統中

    Example: 商品 id 不存在時系統應拒絕儲存並回傳 404
      When 管理者 "Admin" 儲存商品資料
        | id  | name        |
        | 999 | MacBook Pro |
      Then 系統應回傳以下錯誤
        | code | message    |
        | 404  | 商品不存在 |

  Rule: 前置（參數）- name 必須為非空字串

    Example: 傳入空白 name 時系統應拒絕儲存
      When 管理者 "Admin" 儲存商品資料
        | id | name |
        | 1  |      |
      Then 系統應回傳驗證錯誤
        | field | message          |
        | name  | 商品名稱不可為空 |

  Rule: 前置（參數）- regular_price 必須為非負數

    Scenario Outline: 傳入負數 regular_price 時系統應拒絕儲存
      When 管理者 "Admin" 儲存商品資料
        | id | name        | regular_price   |
        | 1  | MacBook Pro | <regular_price> |
      Then 系統應回傳驗證錯誤
        | field         | message        |
        | regular_price | 價格不可為負數 |

      Examples:
        | regular_price |
        | -1            |
        | -100          |

  Rule: 前置（參數）- sale_price 必須不大於 regular_price

    Example: sale_price 大於 regular_price 時系統應拒絕儲存
      When 管理者 "Admin" 儲存商品資料
        | id | name        | regular_price | sale_price |
        | 1  | MacBook Pro | 1000          | 1200       |
      Then 系統應回傳驗證錯誤
        | field      | message          |
        | sale_price | 特價不可大於定價 |

  Rule: 前置（參數）- date_on_sale_to 必須不早於 date_on_sale_from

    Example: date_on_sale_to 早於 date_on_sale_from 時系統應拒絕儲存
      When 管理者 "Admin" 儲存商品資料
        | id | name        | date_on_sale_from | date_on_sale_to |
        | 1  | MacBook Pro | 2024-12-31        | 2024-01-01      |
      Then 系統應回傳驗證錯誤
        | field           | message                  |
        | date_on_sale_to | 結束日期不可早於開始日期 |

  Rule: 前置（參數）- manage_stock=true 時 stock_quantity 必須為非負整數

    Scenario Outline: manage_stock=true 且 stock_quantity 為負數時系統應拒絕儲存
      When 管理者 "Admin" 儲存商品資料
        | id | name        | manage_stock | stock_quantity   |
        | 1  | MacBook Pro | true         | <stock_quantity> |
      Then 系統應回傳驗證錯誤
        | field          | message            |
        | stock_quantity | 庫存數量不可為負數 |

      Examples:
        | stock_quantity |
        | -1             |
        | -50            |

  Rule: 後置（狀態）- 商品欄位必須依傳入參數更新完成

    Example: 傳入有效資料後商品欄位應正確更新
      When 管理者 "Admin" 儲存商品資料
        | id | name        | sku      | regular_price | status  |
        | 1  | MacBook Pro | MBP-2024 | 59900         | publish |
      Then 系統應更新商品且欄位如下
        | id | name        | sku      | regular_price | status  |
        | 1  | MacBook Pro | MBP-2024 | 59900         | publish |

  Rule: 後置（狀態）- stock_quantity=0 且 backorders=no 時 stock_status 必須自動設為 outofstock

    Example: 庫存歸零且不允許補貨預購時庫存狀態應自動設為 outofstock
      When 管理者 "Admin" 儲存商品資料
        | id | name        | manage_stock | stock_quantity | backorders |
        | 1  | MacBook Pro | true         | 0              | no         |
      Then 系統應更新商品且欄位如下
        | id | stock_quantity | backorders | stock_status |
        | 1  | 0              | no         | outofstock   |
