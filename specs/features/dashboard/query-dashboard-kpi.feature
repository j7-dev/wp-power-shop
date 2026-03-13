@ignore @query
Feature: 查詢 Dashboard KPI 統計

  店舖管理者查詢當期與前期的 KPI 數據（總營收、新顧客數、未付款訂單數、未出貨訂單數）
  及其環比變化百分比，用於進入後台時立即掌握業績狀況。

  Background:
    Given 管理者 "Admin" 已登入後台

  Rule: 前置（參數）- period 若提供必須為 today/week/month/year 之一

    Scenario Outline: 傳入無效 period 時系統應拒絕查詢
      When 管理者 "Admin" 查詢 Dashboard KPI
        | period   |
        | <period> |
      Then 系統應回傳驗證錯誤
        | field  | message                                  |
        | period | period 必須為 today、week、month 或 year |

      Examples:
        | period  |
        | daily   |
        | last7   |
        | quarter |

  Rule: 前置（參數）- date_from 與 date_to 若提供必須為有效的 ISO 8601 日期格式

    Scenario Outline: 傳入無效日期格式時系統應拒絕查詢
      When 管理者 "Admin" 查詢 Dashboard KPI
        | date_from   | date_to   |
        | <date_from> | <date_to> |
      Then 系統應回傳驗證錯誤
        | field     | message                  |
        | date_from | 日期必須為 ISO 8601 格式 |

      Examples:
        | date_from  | date_to    |
        | 2024/01/01 | 2024/01/31 |
        | 20240101   | 20240131   |

  Rule: 前置（參數）- period 與 date_from/date_to 必須互斥

    Example: 同時提供 period 與 date_from 時系統應拒絕查詢
      When 管理者 "Admin" 查詢 Dashboard KPI
        | period | date_from  | date_to    |
        | month  | 2024-01-01 | 2024-01-31 |
      Then 系統應回傳驗證錯誤
        | field  | message                                  |
        | period | period 與 date_from/date_to 不可同時使用 |

  Rule: 後置（回應）- 系統必須回傳 current 期間的統計數據

    Example: 查詢 period=month 時系統應回傳 current 期間數據
      When 管理者 "Admin" 查詢 Dashboard KPI
        | period |
        | month  |
      Then 回應應包含以下 current 欄位
        | field               |
        | revenue             |
        | new_customers       |
        | pending_orders      |
        | processing_orders   |

  Rule: 後置（回應）- 系統必須回傳 previous 期間的統計數據

    Example: 查詢 period=month 時系統應同時回傳 previous 期間數據
      When 管理者 "Admin" 查詢 Dashboard KPI
        | period |
        | month  |
      Then 回應應包含以下 previous 欄位
        | field             |
        | revenue           |
        | new_customers     |
        | pending_orders    |
        | processing_orders |

  Rule: 後置（回應）- 系統必須回傳 change.*_pct 各指標的變化率

    Example: 查詢後系統應回傳各指標相對前期的百分比變化
      When 管理者 "Admin" 查詢 Dashboard KPI
        | period |
        | month  |
      Then 回應應包含以下 change 欄位
        | field                 |
        | revenue_pct           |
        | new_customers_pct     |
        | pending_orders_pct    |
        | processing_orders_pct |
