@ignore @query
Feature: 查詢商品列表

  店舖管理者查詢符合篩選條件的商品列表，
  支援分頁、商品類型篩選與發布狀態篩選。

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下商品
      | id | name        | type     | status  | sku      | regular_price | stock_status |
      | 1  | MacBook Pro | simple   | publish | MBP-2024 | 59900         | instock      |
      | 2  | iPhone 15   | simple   | publish | IP15-128 | 29900         | instock      |
      | 3  | iPad Air    | variable | draft   | IPA-WIF  | 19900         | instock      |

  Rule: 前置（參數）- type 若提供必須為有效的商品類型

    Scenario Outline: 傳入無效的 type 時系統應拒絕查詢
      When 管理者 "Admin" 查詢商品列表
        | type    |
        | <type>  |
      Then 系統應回傳驗證錯誤
        | field | message          |
        | type  | 無效的商品類型值 |

      Examples:
        | type     |
        | physical |
        | digital  |

  Rule: 前置（參數）- status 若提供必須為 publish、draft 或 trash

    Scenario Outline: 傳入無效的 status 時系統應拒絕查詢
      When 管理者 "Admin" 查詢商品列表
        | status   |
        | <status> |
      Then 系統應回傳驗證錯誤
        | field  | message                               |
        | status | status 必須為 publish、draft 或 trash |

      Examples:
        | status   |
        | active   |
        | archived |

  Rule: 前置（參數）- per_page 必須為 10、25 或 50 之一

    Scenario Outline: 傳入不在允許範圍的 per_page 時系統應拒絕查詢
      When 管理者 "Admin" 查詢商品列表
        | per_page   |
        | <per_page> |
      Then 系統應回傳驗證錯誤
        | field    | message                      |
        | per_page | per_page 必須為 10、25 或 50 |

      Examples:
        | per_page |
        | 5        |
        | 30       |

  Rule: 後置（回應）- 系統必須回傳包含指定欄位的商品列表

    Example: 查詢商品列表時每筆記錄應包含指定欄位
      When 管理者 "Admin" 查詢商品列表
        | per_page |
        | 10       |
      Then 回應中每筆商品記錄應包含以下欄位
        | field         |
        | id            |
        | name          |
        | type          |
        | status        |
        | sku           |
        | regular_price |
        | stock_status  |

  Rule: 後置（回應）- 預設情況下系統必須依 id 降冪排序商品列表

    Example: 未指定排序時回傳的商品列表應依 id 由大到小排列
      When 管理者 "Admin" 查詢商品列表
        | per_page |
        | 10       |
      Then 回應的商品列表應依 id 降冪排序
        | id |
        | 3  |
        | 2  |
        | 1  |
