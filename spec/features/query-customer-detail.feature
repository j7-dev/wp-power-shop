@ignore
Feature: 查詢顧客詳情

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下顧客
      | id | email             | first_name | last_name | billing_country | shipping_country |
      | 5  | alice@example.com | Alice      | Wang      | TW              | TW               |
    And 顧客 id=5 有以下聯繫備註
      | id | content          | date_created        |
      | 1  | 首次購買確認     | 2024-01-10 09:00:00 |
      | 2  | 回購客戶優惠     | 2024-03-15 14:00:00 |
    And 顧客 id=5 有以下近期訂單
      | id | number    | status    | total | date_created        |
      | 1  | ORDER-001 | completed | 29900 | 2024-01-20 10:00:00 |
      | 2  | ORDER-002 | completed | 59900 | 2024-03-25 15:00:00 |

  Rule: 前置（狀態）- 指定的 customer_id 必須存在於系統中

    Example: customer_id 不存在時系統應回傳 404
      When 管理者 "Admin" 查詢顧客詳情
        | customer_id |
        | 999         |
      Then 系統應回傳以下錯誤
        | code | message    |
        | 404  | 顧客不存在 |

  Rule: 前置（參數）- customer_id 為必填參數

    Example: 未傳入 customer_id 時系統應拒絕查詢
      When 管理者 "Admin" 查詢顧客詳情，未傳入 customer_id
      Then 系統應回傳驗證錯誤
        | field       | message            |
        | customer_id | 顧客 ID 為必填欄位 |

  Rule: 後置（回應）- 系統必須回傳顧客完整資料含 meta_data、billing、shipping

    Example: 查詢顧客 id=5 的詳情應包含完整欄位
      When 管理者 "Admin" 查詢顧客詳情
        | customer_id |
        | 5           |
      Then 回應應包含以下頂層欄位
        | field     |
        | id        |
        | email     |
        | billing   |
        | shipping  |
        | meta_data |

  Rule: 後置（回應）- 聯繫備註必須依 date_created 降冪排序

    Example: 查詢顧客 id=5 的詳情時聯繫備註應依時間由新到舊排列
      When 管理者 "Admin" 查詢顧客詳情
        | customer_id |
        | 5           |
      Then 回應中 notes 陣列第一筆應為
        | content      |
        | 回購客戶優惠 |

  Rule: 後置（回應）- 近期訂單必須依 date_created 降冪且最多回傳 10 筆

    Example: 查詢顧客 id=5 的詳情時近期訂單應依時間由新到舊且不超過 10 筆
      When 管理者 "Admin" 查詢顧客詳情
        | customer_id |
        | 5           |
      Then 回應中 recent_orders 陣列第一筆應為
        | number    |
        | ORDER-002 |
      And 回應中 recent_orders 陣列長度不超過 10

  Rule: 後置（回應）- 顧客購物車為空時必須回傳空陣列

    Example: 顧客購物車無商品時 cart 欄位應為空陣列
      Given 顧客 id=5 的購物車為空
      When 管理者 "Admin" 查詢顧客詳情
        | customer_id |
        | 5           |
      Then 回應中 cart 欄位應為空陣列
