@ignore @query
Feature: 查詢訂單列表

  店舖管理者查詢符合篩選條件的訂單列表，
  支援分頁、關鍵字搜尋、狀態篩選與排序。

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下訂單
      | id | number    | status     | customer_id | total | date_created        |
      | 1  | ORDER-001 | pending    | 5           | 1500  | 2024-01-10 10:00:00 |
      | 2  | ORDER-002 | processing | 6           | 3200  | 2024-01-15 14:30:00 |
      | 3  | ORDER-003 | completed  | 5           | 59900 | 2024-01-20 09:00:00 |

  Rule: 前置（參數）- status 若提供必須為有效的 WooCommerce 訂單狀態

    Scenario Outline: 傳入無效 status 時系統應拒絕查詢
      When 管理者 "Admin" 查詢訂單列表
        | status   |
        | <status> |
      Then 系統應回傳驗證錯誤
        | field  | message          |
        | status | 無效的訂單狀態值 |

      Examples:
        | status  |
        | shipped |
        | paid    |
        | unknown |

  Rule: 前置（參數）- per_page 必須為 10、25 或 50 之一

    Scenario Outline: 傳入不在允許範圍的 per_page 時系統應拒絕查詢
      When 管理者 "Admin" 查詢訂單列表
        | per_page   |
        | <per_page> |
      Then 系統應回傳驗證錯誤
        | field    | message                      |
        | per_page | per_page 必須為 10、25 或 50 |

      Examples:
        | per_page |
        | 5        |
        | 20       |
        | 100      |

  Rule: 前置（參數）- orderby 必須為 date 或 id

    Scenario Outline: 傳入無效的 orderby 值時系統應拒絕查詢
      When 管理者 "Admin" 查詢訂單列表
        | orderby   |
        | <orderby> |
      Then 系統應回傳驗證錯誤
        | field   | message                   |
        | orderby | orderby 必須為 date 或 id |

      Examples:
        | orderby |
        | total   |
        | status  |

  Rule: 後置（回應）- 系統必須回傳包含指定欄位的訂單列表

    Example: 查詢訂單列表時每筆記錄應包含指定欄位
      When 管理者 "Admin" 查詢訂單列表
        | per_page |
        | 10       |
      Then 回應中每筆訂單記錄應包含以下欄位
        | field        |
        | id           |
        | number       |
        | status       |
        | customer_id  |
        | total        |
        | date_created |

  Rule: 後置（回應）- 系統必須回傳含 total 與 total_pages 的分頁資訊

    Example: 查詢訂單列表時回應應包含分頁資訊
      When 管理者 "Admin" 查詢訂單列表
        | page | per_page |
        | 1    | 10       |
      Then 回應應包含以下分頁欄位
        | field       |
        | total       |
        | total_pages |
