@ignore @query
Feature: 查詢顧客列表

  店舖管理者查詢符合篩選條件的顧客列表，
  支援分頁、關鍵字搜尋（姓名/Email）與角色篩選。

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下顧客
      | id | first_name | last_name | email             | orders_count | total_spent | date_created        |
      | 5  | Alice      | Wang      | alice@example.com | 3            | 89700       | 2024-01-05 08:00:00 |
      | 6  | Bob        | Chen      | bob@example.com   | 1            | 29900       | 2024-03-10 11:00:00 |

  Rule: 前置（參數）- per_page 必須為 10、25 或 50 之一

    Scenario Outline: 傳入不在允許範圍的 per_page 時系統應拒絕查詢
      When 管理者 "Admin" 查詢顧客列表
        | per_page   |
        | <per_page> |
      Then 系統應回傳驗證錯誤
        | field    | message                      |
        | per_page | per_page 必須為 10、25 或 50 |

      Examples:
        | per_page |
        | 5        |
        | 15       |
        | 200      |

  Rule: 前置（參數）- role 若提供必須為有效的 WordPress 角色名稱

    Scenario Outline: 傳入無效的 role 時系統應拒絕查詢
      When 管理者 "Admin" 查詢顧客列表
        | role    |
        | <role>  |
      Then 系統應回傳驗證錯誤
        | field | message               |
        | role  | 無效的 WordPress 角色 |

      Examples:
        | role       |
        | superuser  |
        | vip_member |

  Rule: 後置（回應）- 系統必須回傳包含指定欄位的顧客列表

    Example: 查詢顧客列表時每筆記錄應包含指定欄位
      When 管理者 "Admin" 查詢顧客列表
        | per_page |
        | 10       |
      Then 回應中每筆顧客記錄應包含以下欄位
        | field        |
        | id           |
        | first_name   |
        | last_name    |
        | email        |
        | orders_count |
        | total_spent  |
        | date_created |

  Rule: 後置（回應）- 系統必須回傳含 total 與 total_pages 的分頁資訊

    Example: 查詢顧客列表時回應應包含完整的分頁資訊
      When 管理者 "Admin" 查詢顧客列表
        | page | per_page |
        | 1    | 10       |
      Then 回應應包含以下分頁欄位
        | field       |
        | total       |
        | total_pages |
