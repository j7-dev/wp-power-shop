@ignore @command
Feature: 批量刪除訂單

  店舖管理者一次刪除多筆選取的訂單（force delete，不移至垃圾桶），
  用於有效率地清理垃圾訂單或測試訂單。

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下訂單
      | id | number    | status    |
      | 1  | ORDER-001 | cancelled |
      | 2  | ORDER-002 | cancelled |
      | 3  | ORDER-003 | cancelled |

  Rule: 前置（狀態）- 所有指定的 order_ids 必須存在於系統中

    Example: order_ids 包含不存在的 ID 時系統應拒絕並回傳錯誤
      When 管理者 "Admin" 批量刪除訂單
        | order_ids |
        | 1,2,999   |
      Then 系統應回傳以下錯誤
        | code | message            |
        | 404  | 訂單 id=999 不存在 |

  Rule: 前置（參數）- order_ids 不可為空陣列

    Example: 傳入空 order_ids 時系統應拒絕執行刪除
      When 管理者 "Admin" 批量刪除訂單
        | order_ids |
        |           |
      Then 系統應回傳驗證錯誤
        | field     | message              |
        | order_ids | 訂單 ID 清單不可為空 |

  Rule: 後置（狀態）- 所有指定的訂單必須從系統中刪除

    Example: 傳入有效 order_ids 後對應訂單應從系統中移除
      When 管理者 "Admin" 批量刪除訂單
        | order_ids |
        | 1,2,3     |
      Then 系統中不應再存在以下訂單
        | id |
        | 1  |
        | 2  |
        | 3  |
