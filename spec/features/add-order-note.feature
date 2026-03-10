@ignore
Feature: 新增訂單備註

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下訂單
      | id | number    | status     |
      | 1  | ORDER-001 | processing |

  Rule: 前置（狀態）- 指定的 order_id 必須存在於系統中

    Example: order_id 不存在時系統應回傳 404
      When 管理者 "Admin" 新增訂單備註
        | order_id | note       |
        | 999      | 請盡快出貨 |
      Then 系統應回傳以下錯誤
        | code | message    |
        | 404  | 訂單不存在 |

  Rule: 前置（參數）- note 必須為非空字串

    Example: 傳入空白 note 時系統應拒絕新增
      When 管理者 "Admin" 新增訂單備註
        | order_id | note |
        | 1        |      |
      Then 系統應回傳驗證錯誤
        | field | message          |
        | note  | 備註內容不可為空 |

  Rule: 後置（狀態）- OrderNote 必須建立並關聯至指定的 order_id

    Example: 傳入有效資料後 OrderNote 應建立並關聯至訂單
      When 管理者 "Admin" 新增訂單備註
        | order_id | note         | customer_note |
        | 1        | 客戶要求加急 | false         |
      Then 訂單 id=1 應有以下備註
        | note         | customer_note | author |
        | 客戶要求加急 | false         | Admin  |

  Rule: 後置（狀態）- 備註必須出現在訂單時間軸的最上方

    Example: 新增備註後該備註應為時間軸的第一筆記錄
      When 管理者 "Admin" 新增訂單備註
        | order_id | note           |
        | 1        | 已聯繫倉庫出貨 |
      Then 訂單 id=1 時間軸第一筆備註應為
        | note           |
        | 已聯繫倉庫出貨 |

  Rule: 後置（狀態）- customer_note=true 時備註必須對顧客可見

    Example: 設定 customer_note=true 後顧客端應能看到該備註
      When 管理者 "Admin" 新增訂單備註
        | order_id | note       | customer_note |
        | 1        | 商品已出貨 | true          |
      Then 訂單 id=1 應有以下備註
        | note       | customer_note |
        | 商品已出貨 | true          |
