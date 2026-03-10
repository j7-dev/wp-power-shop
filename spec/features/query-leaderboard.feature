@ignore
Feature: 查詢排行榜

  Background:
    Given 管理者 "Admin" 已登入後台

  Rule: 前置（參數）- type 必須為 product 或 customer

    Scenario Outline: 傳入無效 type 時系統應拒絕查詢
      When 管理者 "Admin" 查詢排行榜
        | type    | date_from  | date_to    |
        | <type>  | 2024-01-01 | 2024-01-31 |
      Then 系統應回傳驗證錯誤
        | field | message                         |
        | type  | type 必須為 product 或 customer |

      Examples:
        | type    |
        | order   |
        | revenue |

  Rule: 前置（參數）- 日期範圍必須有效

    Example: date_to 早於 date_from 時系統應拒絕查詢
      When 管理者 "Admin" 查詢排行榜
        | type    | date_from  | date_to    |
        | product | 2024-12-31 | 2024-01-01 |
      Then 系統應回傳驗證錯誤
        | field   | message                  |
        | date_to | 結束日期不可早於開始日期 |

  Rule: 後置（回應）- 系統必須回傳最多前 5 名的排行榜資料

    Example: 查詢商品排行榜時系統應回傳最多 5 筆資料
      When 管理者 "Admin" 查詢排行榜
        | type    | date_from  | date_to    |
        | product | 2024-01-01 | 2024-12-31 |
      Then 回應的排行榜項目數量不超過 5

  Rule: 後置（回應）- 每筆記錄必須包含 id、name、count、total 欄位

    Example: 查詢顧客排行榜時每筆記錄應包含指定欄位
      When 管理者 "Admin" 查詢排行榜
        | type     | date_from  | date_to    |
        | customer | 2024-01-01 | 2024-12-31 |
      Then 回應中每筆排行榜記錄應包含以下欄位
        | field |
        | id    |
        | name  |
        | count |
        | total |

  Rule: 後置（回應）- 結果必須依 total 降冪排序

    Example: 查詢商品排行榜時回傳結果應依 total 由大到小排列
      When 管理者 "Admin" 查詢排行榜
        | type    | date_from  | date_to    |
        | product | 2024-01-01 | 2024-12-31 |
      Then 回應的排行榜資料應依 total 降冪排序

  Rule: 後置（回應）- 無資料時必須回傳空陣列

    Example: 指定期間內無銷售資料時系統應回傳空陣列
      When 管理者 "Admin" 查詢排行榜
        | type    | date_from  | date_to    |
        | product | 2000-01-01 | 2000-01-31 |
      Then 回應應為
        | leaderboard |
        | []          |
