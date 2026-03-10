@ignore
Feature: 自動生成商品變體

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下商品
      | id | name      | type     | status  |
      | 10 | iPhone 15 | variable | publish |
    And 商品 id=10 已設定以下屬性
      | name | options            | variation |
      | 顏色 | 黑色,白色          | true      |
      | 尺寸 | 128GB,256GB,512GB  | true      |

  Rule: 前置（狀態）- 商品類型必須為 variable

    Example: 對 simple 類型商品執行生成變體時系統應拒絕
      Given 系統中已存在以下商品
        | id | name        | type   | status  |
        | 20 | AirPods Pro | simple | publish |
      When 管理者 "Admin" 自動生成商品變體
        | product_id |
        | 20         |
      Then 系統應回傳以下錯誤
        | code | message                 |
        | 400  | 商品類型必須為 variable |

  Rule: 前置（狀態）- 商品必須至少有一個屬性標記為 variation=true

    Example: 所有屬性 variation=false 時系統應拒絕生成變體
      Given 系統中已存在以下商品
        | id | name     | type     | status  |
        | 30 | iPad Pro | variable | publish |
      And 商品 id=30 已設定以下屬性
        | name | options   | variation |
        | 顏色 | 黑色,白色 | false     |
      When 管理者 "Admin" 自動生成商品變體
        | product_id |
        | 30         |
      Then 系統應回傳以下錯誤
        | code | message                          |
        | 400  | 至少一個屬性必須標記為 variation |

  Rule: 前置（狀態）- 各 variation 屬性的 options 必須為非空

    Example: 存在 options 為空的 variation 屬性時系統應拒絕生成
      Given 系統中已存在以下商品
        | id | name     | type     | status  |
        | 40 | Mac Mini | variable | publish |
      And 商品 id=40 已設定以下屬性
        | name | options | variation |
        | 顏色 |         | true      |
      When 管理者 "Admin" 自動生成商品變體
        | product_id |
        | 40         |
      Then 系統應回傳以下錯誤
        | code | message               |
        | 400  | 屬性 options 不可為空 |

  Rule: 前置（參數）- product_id 必須存在且商品類型為 variable

    Example: product_id 不存在時系統應回傳 404
      When 管理者 "Admin" 自動生成商品變體
        | product_id |
        | 999        |
      Then 系統應回傳以下錯誤
        | code | message    |
        | 404  | 商品不存在 |

  Rule: 後置（狀態）- 系統必須依屬性笛卡兒積建立所有變體

    Example: 2色×3尺寸的商品應生成 6 個變體
      When 管理者 "Admin" 自動生成商品變體
        | product_id |
        | 10         |
      Then 商品 id=10 應有以下變體
        | attributes                |
        | 顏色:黑色, 尺寸:128GB     |
        | 顏色:黑色, 尺寸:256GB     |
        | 顏色:黑色, 尺寸:512GB     |
        | 顏色:白色, 尺寸:128GB     |
        | 顏色:白色, 尺寸:256GB     |
        | 顏色:白色, 尺寸:512GB     |

  Rule: 後置（狀態）- 已存在相同屬性組合的變體不得重複建立

    Example: 部分變體已存在時系統應只建立缺少的變體
      Given 商品 id=10 已存在以下變體
        | attributes            |
        | 顏色:黑色, 尺寸:128GB |
      When 管理者 "Admin" 自動生成商品變體
        | product_id |
        | 10         |
      Then 商品 id=10 的變體總數應為 6

  Rule: 後置（狀態）- 新建立的變體 status 必須為 publish 且價格與庫存為空

    Example: 自動生成的新變體應有正確的初始狀態
      When 管理者 "Admin" 自動生成商品變體
        | product_id |
        | 10         |
      Then 所有新建立的變體應符合以下初始狀態
        | status  | regular_price | sale_price | stock_quantity |
        | publish |               |            |                |
