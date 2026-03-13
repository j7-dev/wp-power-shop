@ignore @command
Feature: 建立訂單

  店舖管理者在後台手動為指定顧客（或訪客）建立一筆新訂單，
  用於處理電話訂購或補單需求。

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下商品
      | id | name        | status  | regular_price |
      | 1  | MacBook Pro | publish | 59900         |
      | 2  | iPhone 15   | publish | 29900         |
    And 系統中已存在以下顧客
      | id | email             | first_name | last_name |
      | 5  | alice@example.com | Alice      | Wang      |

  Rule: 前置（參數）- line_items 不可為空陣列

    Example: 傳入空 line_items 時系統應拒絕建立訂單
      When 管理者 "Admin" 建立訂單
        | line_items | billing_first_name | billing_last_name | billing_email     |
        |            | Alice              | Wang              | alice@example.com |
      Then 系統應回傳驗證錯誤
        | field      | message          |
        | line_items | 訂單項目不可為空 |

  Rule: 前置（參數）- 每個 line_item 的 product_id 必須存在

    Example: line_item 指向不存在的 product_id 時系統應拒絕建立
      When 管理者 "Admin" 建立訂單，包含以下 line_items
        | product_id | quantity |
        | 999        | 1        |
      Then 系統應回傳驗證錯誤
        | field      | message    |
        | product_id | 商品不存在 |

  Rule: 前置（參數）- quantity 必須為正整數

    Scenario Outline: 傳入無效 quantity 時系統應拒絕建立
      When 管理者 "Admin" 建立訂單，包含以下 line_items
        | product_id | quantity   |
        | 1          | <quantity> |
      Then 系統應回傳驗證錯誤
        | field    | message          |
        | quantity | 數量必須為正整數 |

      Examples:
        | quantity |
        | 0        |
        | -1       |

  Rule: 前置（參數）- billing 地址必須填寫

    Example: 未傳入 billing 地址時系統應拒絕建立
      When 管理者 "Admin" 建立訂單，包含以下 line_items，但缺少 billing
        | product_id | quantity |
        | 1          | 1        |
      Then 系統應回傳驗證錯誤
        | field   | message            |
        | billing | 帳單地址為必填欄位 |

  Rule: 後置（狀態）- 系統必須建立 status=pending 的新訂單

    Example: 傳入有效資料後系統應建立 status=pending 的訂單
      When 管理者 "Admin" 建立訂單
        | customer_id | billing_first_name | billing_last_name | billing_email     | billing_country |
        | 5           | Alice              | Wang              | alice@example.com | TW              |
      And 訂單包含以下 line_items
        | product_id | quantity |
        | 1          | 1        |
        | 2          | 2        |
      Then 系統應建立一筆訂單，且欄位如下
        | customer_id | status  |
        | 5           | pending |

  Rule: 後置（狀態）- 指定 customer_id 時訂單必須關聯至該顧客

    Example: 建立訂單並指定 customer_id=5 後訂單應關聯至顧客 Alice
      When 管理者 "Admin" 建立訂單
        | customer_id | billing_first_name | billing_email     | billing_country |
        | 5           | Alice              | alice@example.com | TW              |
      And 訂單包含以下 line_items
        | product_id | quantity |
        | 1          | 1        |
      Then 系統應建立一筆訂單，且欄位如下
        | customer_id | status  |
        | 5           | pending |
