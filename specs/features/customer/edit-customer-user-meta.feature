@ignore @command
Feature: 編輯顧客 UserMeta

  店舖管理者直接修改顧客的 WordPress User Meta 特定鍵值（高風險操作），
  用於修正異常的顧客資料或調整系統內部標記。

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下顧客
      | id | email             | first_name |
      | 5  | alice@example.com | Alice      |

  Rule: 前置（狀態）- 指定的 customer_id 必須存在於系統中

    Example: customer_id 不存在時系統應回傳 404
      When 管理者 "Admin" 編輯顧客 UserMeta
        | customer_id | meta_key  | meta_value |
        | 999         | vip_level | gold       |
      Then 系統應回傳以下錯誤
        | code | message    |
        | 404  | 顧客不存在 |

  Rule: 前置（參數）- meta_key 必須為非空字串

    Example: 傳入空白 meta_key 時系統應拒絕更新
      When 管理者 "Admin" 編輯顧客 UserMeta
        | customer_id | meta_key | meta_value |
        | 5           |          | gold       |
      Then 系統應回傳驗證錯誤
        | field    | message         |
        | meta_key | Meta 鍵不可為空 |

  Rule: 前置（參數）- 操作必須通過雙重確認防護

    Example: 未提供雙重確認旗標時系統應拒絕執行
      When 管理者 "Admin" 編輯顧客 UserMeta
        | customer_id | meta_key  | meta_value | confirmed |
        | 5           | vip_level | gold       | false     |
      Then 系統應回傳驗證錯誤
        | field     | message            |
        | confirmed | 此操作需要雙重確認 |

  Rule: 後置（狀態）- 指定的 User Meta 鍵值必須更新完成

    Example: 傳入有效資料且通過確認後 UserMeta 應正確更新
      When 管理者 "Admin" 編輯顧客 UserMeta
        | customer_id | meta_key  | meta_value | confirmed |
        | 5           | vip_level | gold       | true      |
      Then 顧客 id=5 的 UserMeta 應如下
        | meta_key  | meta_value |
        | vip_level | gold       |
