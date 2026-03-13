@ignore @command
Feature: 編輯訂單地址

  店舖管理者修改訂單的帳單地址或運送地址欄位，
  用於處理顧客填寫錯誤地址的情況，確保出貨資訊正確。

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下訂單
      | id | number    | status     |
      | 1  | ORDER-001 | processing |

  Rule: 前置（狀態）- 指定的 order_id 必須存在於系統中

    Example: order_id 不存在時系統應回傳 404
      When 管理者 "Admin" 編輯訂單地址
        | order_id | address_type | first_name |
        | 999      | billing      | Alice      |
      Then 系統應回傳以下錯誤
        | code | message    |
        | 404  | 訂單不存在 |

  Rule: 前置（參數）- address_type 必須為 billing 或 shipping

    Scenario Outline: 傳入無效的 address_type 時系統應拒絕更新
      When 管理者 "Admin" 編輯訂單地址
        | order_id | address_type   | first_name |
        | 1        | <address_type> | Alice      |
      Then 系統應回傳驗證錯誤
        | field        | message                            |
        | address_type | 地址類型必須為 billing 或 shipping |

      Examples:
        | address_type |
        | invoice      |
        | home         |

  Rule: 前置（參數）- country 若填寫則必須為有效的 ISO 3166-1 alpha-2 代碼

    Example: 傳入無效的 country 代碼時系統應拒絕更新
      When 管理者 "Admin" 編輯訂單地址
        | order_id | address_type | country |
        | 1        | billing      | TAIWAN  |
      Then 系統應回傳驗證錯誤
        | field   | message                                      |
        | country | 國家代碼必須為有效的 ISO 3166-1 alpha-2 格式 |

  Rule: 後置（狀態）- 訂單對應的地址欄位必須更新完成

    Example: 傳入有效 billing 地址後訂單帳單地址應正確更新
      When 管理者 "Admin" 編輯訂單地址
        | order_id | address_type | first_name | last_name | address_1     | city | country | postcode | email             |
        | 1        | billing      | Alice      | Wang      | 信義路五段7號 | 台北 | TW      | 110      | alice@example.com |
      Then 系統應更新訂單 id=1 的 billing 地址如下
        | first_name | last_name | address_1     | city | country | postcode | email             |
        | Alice      | Wang      | 信義路五段7號 | 台北 | TW      | 110      | alice@example.com |
