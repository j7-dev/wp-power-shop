@ignore @query
Feature: 查詢營收趨勢圖表

  店舖管理者查詢指定期間的營收與訂單數趨勢資料，依選定時間區間分組，
  包含去年同期比較，用於透過視覺化圖表識別業績高峰與低谷。

  Background:
    Given 管理者 "Admin" 已登入後台

  Rule: 前置（參數）- interval 必須為 day/week/month/year 之一

    Scenario Outline: 傳入無效 interval 時系統應拒絕查詢
      When 管理者 "Admin" 查詢營收趨勢圖表
        | interval   | date_from  | date_to    |
        | <interval> | 2024-01-01 | 2024-12-31 |
      Then 系統應回傳驗證錯誤
        | field    | message                                  |
        | interval | interval 必須為 day、week、month 或 year |

      Examples:
        | interval |
        | hour     |
        | quarter  |
        | daily    |

  Rule: 前置（參數）- 查詢期間的日期格式必須有效

    Example: 傳入無效日期格式時系統應拒絕查詢
      When 管理者 "Admin" 查詢營收趨勢圖表
        | interval | date_from  | date_to    |
        | day      | 2024/01/01 | 2024/12/31 |
      Then 系統應回傳驗證錯誤
        | field     | message                  |
        | date_from | 日期必須為 ISO 8601 格式 |

  Rule: 後置（回應）- 系統必須回傳依區間分組的時序資料陣列

    Example: 查詢 2024 年 1 月依日分組的趨勢時系統應回傳時序資料
      When 管理者 "Admin" 查詢營收趨勢圖表
        | interval | date_from  | date_to    |
        | day      | 2024-01-01 | 2024-01-31 |
      Then 回應應包含 intervals 陣列，且每筆記錄包含以下欄位
        | field        |
        | date_start   |
        | date_end     |
        | revenue      |
        | orders_count |

  Rule: 後置（回應）- 系統必須同時回傳去年同期的時序資料

    Example: 查詢趨勢圖表時回應應同時包含去年同期資料
      When 管理者 "Admin" 查詢營收趨勢圖表
        | interval | date_from  | date_to    |
        | month    | 2024-01-01 | 2024-12-31 |
      Then 回應應包含以下頂層欄位
        | field                   |
        | intervals               |
        | previous_year_intervals |
