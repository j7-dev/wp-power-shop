@ignore
Feature: 更新訂單狀態

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下訂單
      | id | number    | status  | customer_id |
      | 1  | ORDER-001 | pending | 5           |

  Rule: 前置（狀態）- 指定的 order_id 必須存在於系統中

    Example: order_id 不存在時系統應拒絕更新並回傳 404
      When 管理者 "Admin" 更新訂單狀態
        | order_id | status     |
        | 999      | processing |
      Then 系統應回傳以下錯誤
        | code | message    |
        | 404  | 訂單不存在 |

  Rule: 前置（參數）- status 必須為有效的 WooCommerce 訂單狀態

    Scenario Outline: 傳入無效狀態值時系統應拒絕更新
      When 管理者 "Admin" 更新訂單狀態
        | order_id | status   |
        | 1        | <status> |
      Then 系統應回傳驗證錯誤
        | field  | message          |
        | status | 無效的訂單狀態值 |

      Examples:
        | status  |
        | unknown |
        | shipped |
        | paid    |

  Rule: 後置（狀態）- 訂單 status 必須更新為指定的新狀態

    Example: 傳入有效 status 後訂單狀態應正確更新
      When 管理者 "Admin" 更新訂單狀態
        | order_id | status     |
        | 1        | processing |
      Then 系統應更新訂單且欄位如下
        | id | status     |
        | 1  | processing |

  Rule: 後置（狀態）- WooCommerce 必須觸發對應的狀態轉換 Hook

    Example: 狀態從 pending 更新為 processing 後應觸發 woocommerce_order_status_changed Hook
      When 管理者 "Admin" 更新訂單狀態
        | order_id | status     |
        | 1        | processing |
      Then 系統應觸發以下 WordPress Hook
        | hook                             | old_status | new_status |
        | woocommerce_order_status_changed | pending    | processing |

  Rule: 後置（狀態）- 訂單時間軸必須新增一筆狀態變更記錄

    Example: 更新訂單狀態後時間軸應出現新的狀態變更備註
      When 管理者 "Admin" 更新訂單狀態
        | order_id | status     |
        | 1        | processing |
      Then 訂單 id=1 的時間軸最新一筆記錄應如下
        | content                              |
        | 訂單狀態由「待處理」變更為「處理中」 |
