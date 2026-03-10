@ignore
Feature: 查詢營收分析

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中存在 2023 年和 2024 年的訂單資料

  Rule: 前置（參數）- date_from 必須為有效的 ISO 8601 日期格式

    Scenario Outline: 傳入無效的 date_from 格式時系統應拒絕查詢
      When 管理者 "Admin" 查詢營收分析
        | date_from   | date_to    | interval |
        | <date_from> | 2024-12-31 | month    |
      Then 系統應回傳驗證錯誤
        | field     | message                  |
        | date_from | 日期必須為 ISO 8601 格式 |

      Examples:
        | date_from  |
        | 2024/01/01 |
        | 20240101   |
        | 01-01-2024 |

  Rule: 前置（參數）- date_to 必須為有效的 ISO 8601 日期格式

    Example: 傳入無效的 date_to 格式時系統應拒絕查詢
      When 管理者 "Admin" 查詢營收分析
        | date_from  | date_to    | interval |
        | 2024-01-01 | 2024/12/31 | month    |
      Then 系統應回傳驗證錯誤
        | field   | message                  |
        | date_to | 日期必須為 ISO 8601 格式 |

  Rule: 前置（參數）- 日期範圍不得超過 1 年

    Example: date_to 超過 date_from 一年以上時系統應拒絕查詢
      When 管理者 "Admin" 查詢營收分析
        | date_from  | date_to    | interval |
        | 2023-01-01 | 2024-12-31 | month    |
      Then 系統應回傳驗證錯誤
        | field   | message                |
        | date_to | 查詢範圍不得超過 1 年  |

  Rule: 前置（參數）- interval 必須為 day、week 或 month 之一

    Scenario Outline: 傳入無效 interval 時系統應拒絕查詢
      When 管理者 "Admin" 查詢營收分析
        | date_from  | date_to    | interval   |
        | 2024-01-01 | 2024-12-31 | <interval> |
      Then 系統應回傳驗證錯誤
        | field    | message                            |
        | interval | interval 必須為 day、week 或 month |

      Examples:
        | interval |
        | hour     |
        | year     |
        | quarter  |

  Rule: 前置（參數）- product_ids 若提供必須為有效的商品 ID 陣列

    Example: product_ids 包含不存在的商品 ID 時系統應拒絕查詢
      When 管理者 "Admin" 查詢營收分析
        | date_from  | date_to    | interval | product_ids |
        | 2024-01-01 | 2024-12-31 | month    | 1,2,999     |
      Then 系統應回傳驗證錯誤
        | field       | message            |
        | product_ids | 商品 id=999 不存在 |

  Rule: 後置（回應）- 系統必須回傳 totals 包含指定欄位

    Example: 查詢 2024 年月度營收分析時 totals 應包含指定欄位
      When 管理者 "Admin" 查詢營收分析
        | date_from  | date_to    | interval |
        | 2024-01-01 | 2024-12-31 | month    |
      Then 回應中 totals 應包含以下欄位
        | field           |
        | gross_revenue   |
        | net_revenue     |
        | orders_count    |
        | avg_order_value |

  Rule: 後置（回應）- 系統必須回傳依 interval 分組的 intervals 時序資料

    Example: 查詢 Q1 月度分析時 intervals 陣列應有 3 筆資料且包含指定欄位
      When 管理者 "Admin" 查詢營收分析
        | date_from  | date_to    | interval |
        | 2024-01-01 | 2024-03-31 | month    |
      Then 回應中 intervals 陣列應有 3 筆資料，且每筆包含以下欄位
        | field         |
        | date_start    |
        | date_end      |
        | gross_revenue |
        | orders_count  |

  Rule: 後置（回應）- 無資料時 YoY% 必須為 null

    Example: 去年同期無訂單資料時 yoy_pct 欄位應回傳 null
      When 管理者 "Admin" 查詢營收分析
        | date_from  | date_to    | interval |
        | 2000-01-01 | 2000-12-31 | month    |
      Then 回應中 yoy_pct 欄位應為 null
