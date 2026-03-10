@ignore
Feature: 編輯顧客資料

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下顧客
      | id | email             | first_name | last_name |
      | 5  | alice@example.com | Alice      | Wang      |
      | 6  | bob@example.com   | Bob        | Chen      |

  Rule: 前置（狀態）- 指定的 customer_id 必須存在於系統中

    Example: customer_id 不存在時系統應回傳 404
      When 管理者 "Admin" 編輯顧客資料
        | customer_id | first_name |
        | 999         | Alice      |
      Then 系統應回傳以下錯誤
        | code | message    |
        | 404  | 顧客不存在 |

  Rule: 前置（參數）- email 若填寫則必須為有效的 Email 格式

    Scenario Outline: 傳入無效 email 格式時系統應拒絕更新
      When 管理者 "Admin" 編輯顧客資料
        | customer_id | email    |
        | 5           | <email>  |
      Then 系統應回傳驗證錯誤
        | field | message          |
        | email | Email 格式不正確 |

      Examples:
        | email        |
        | not-an-email |
        | @missing.com |
        | missing@     |

  Rule: 前置（參數）- email 必須在系統中唯一

    Example: 傳入系統中已被其他顧客使用的 email 時應拒絕更新
      When 管理者 "Admin" 編輯顧客資料
        | customer_id | email           |
        | 5           | bob@example.com |
      Then 系統應回傳驗證錯誤
        | field | message           |
        | email | 此 Email 已被使用 |

  Rule: 後置（狀態）- 顧客欄位必須依傳入參數更新完成

    Example: 傳入有效資料後顧客欄位應正確更新
      When 管理者 "Admin" 編輯顧客資料
        | customer_id | first_name | last_name | email                  |
        | 5           | Alice      | Lin       | alice.lin@example.com  |
      Then 系統應更新顧客且欄位如下
        | id | first_name | last_name | email                  |
        | 5  | Alice      | Lin       | alice.lin@example.com  |

  Rule: 後置（狀態）- WooCommerce Customer 與對應的 WP User 必須同步更新

    Example: 更新顧客 email 後對應的 WP User 應同步更新
      When 管理者 "Admin" 編輯顧客資料
        | customer_id | email                  |
        | 5           | alice.new@example.com  |
      Then WP User id=5 的 email 應同步更新為 "alice.new@example.com"
