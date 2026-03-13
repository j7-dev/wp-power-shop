@ignore @command
Feature: 新增商品分類

  店舖管理者在 WooCommerce 建立一個新的商品分類節點，
  可指定父分類形成階層結構，維護清晰的商品分類體系。

  Background:
    Given 管理者 "Admin" 已登入後台
    And 系統中已存在以下商品分類
      | id | name   | slug        |
      | 1  | 電子產品 | electronics |

  Rule: 前置（參數）- name 必須為非空字串

    Example: 傳入空白 name 時系統應拒絕建立分類
      When 管理者 "Admin" 新增商品分類
        | name |
        |      |
      Then 系統應回傳驗證錯誤
        | field | message          |
        | name  | 分類名稱不可為空 |

  Rule: 前置（參數）- slug 若填寫則必須在 product_cat 中唯一

    Example: 傳入已存在的 slug 時系統應拒絕建立
      When 管理者 "Admin" 新增商品分類
        | name | slug        |
        | 電腦 | electronics |
      Then 系統應回傳驗證錯誤
        | field | message                |
        | slug  | 分類別名已存在，請更換 |

  Rule: 前置（參數）- parent 若填寫則必須為有效的分類 ID

    Example: parent 指向不存在的分類 ID 時系統應拒絕建立
      When 管理者 "Admin" 新增商品分類
        | name | parent |
        | 筆電 | 999    |
      Then 系統應回傳驗證錯誤
        | field  | message      |
        | parent | 父分類不存在 |

  Rule: 後置（狀態）- 系統必須建立新的 ProductCategory 節點

    Example: 傳入有效資料後系統應建立新分類
      When 管理者 "Admin" 新增商品分類
        | name | slug   | description      |
        | 筆電 | laptop | 各品牌筆記型電腦 |
      Then 系統應建立一筆分類，且欄位如下
        | name | slug   | description      |
        | 筆電 | laptop | 各品牌筆記型電腦 |

  Rule: 後置（狀態）- 指定 parent 時新分類必須成為該 parent 的子分類

    Example: 指定有效 parent 後新分類應成為其子分類
      When 管理者 "Admin" 新增商品分類
        | name | slug   | parent |
        | 筆電 | laptop | 1      |
      Then 系統應建立一筆分類，且欄位如下
        | name | slug   | parent |
        | 筆電 | laptop | 1      |
