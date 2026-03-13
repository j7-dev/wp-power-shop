@ignore @command
Feature: 新增顧客聯繫備註

  店舖管理者在顧客檔案新增一則聯繫記錄備註，
  用於記錄與顧客的溝通歷程，方便後續跟進。

  Background:
    Given 管理者 "Admin" 已登入後台，用戶 id=1
    And 系統中已存在以下顧客
      | id | email             | first_name |
      | 5  | alice@example.com | Alice      |

  Rule: 前置（狀態）- 指定的 customer_id 必須存在於系統中

    Example: customer_id 不存在時系統應回傳 404
      When 管理者 "Admin" 新增顧客聯繫備註
        | customer_id | content      |
        | 999         | 顧客確認收貨 |
      Then 系統應回傳以下錯誤
        | code | message    |
        | 404  | 顧客不存在 |

  Rule: 前置（參數）- content 必須為非空字串

    Example: 傳入空白 content 時系統應拒絕新增
      When 管理者 "Admin" 新增顧客聯繫備註
        | customer_id | content |
        | 5           |         |
      Then 系統應回傳驗證錯誤
        | field   | message          |
        | content | 備註內容不可為空 |

  Rule: 後置（狀態）- CustomerNote 必須建立並關聯至指定的 customer_id

    Example: 傳入有效資料後 CustomerNote 應建立並關聯至顧客
      When 管理者 "Admin" 新增顧客聯繫備註
        | customer_id | content          |
        | 5           | 顧客反映包裝破損 |
      Then 顧客 id=5 應有以下聯繫備註
        | content          | author_id |
        | 顧客反映包裝破損 | 1         |

  Rule: 後置（狀態）- author_id 必須為當前登入管理者的 id

    Example: 建立備註後 author_id 應為當前登入者 id=1
      When 管理者 "Admin" 新增顧客聯繫備註
        | customer_id | content        |
        | 5           | 已安排重新寄送 |
      Then 最新建立的備註 author_id 應為 1

  Rule: 後置（狀態）- 備註必須出現在聯繫記錄的最上方

    Example: 新增備註後該備註應為聯繫記錄的第一筆
      When 管理者 "Admin" 新增顧客聯繫備註
        | customer_id | content        |
        | 5           | 本次問題已解決 |
      Then 顧客 id=5 聯繫記錄第一筆應為
        | content        |
        | 本次問題已解決 |
