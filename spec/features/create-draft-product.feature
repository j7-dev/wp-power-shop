@ignore
Feature: 建立草稿商品

  Background:
    Given 管理者 "Admin" 已登入後台

  Rule: 前置（參數）- name 必須為非空字串

    Scenario Outline: 傳入無效的 name 時系統應拒絕建立
      When 管理者 "Admin" 建立草稿商品
        | name   |
        | <name> |
      Then 系統應回傳驗證錯誤
        | field | message          |
        | name  | 商品名稱不可為空 |

      Examples:
        | name |
        |      |

  Rule: 後置（狀態）- 系統必須建立一筆 status=draft 的商品

    Example: 傳入有效 name 後系統應建立 status=draft 的商品
      When 管理者 "Admin" 建立草稿商品
        | name        |
        | MacBook Pro |
      Then 系統應建立一筆商品，且欄位如下
        | name        | status |
        | MacBook Pro | draft  |

  Rule: 後置（狀態）- 新商品必須出現在商品列表中

    Example: 建立草稿商品後應可在商品列表中查到該商品
      Given 管理者 "Admin" 已建立草稿商品
        | name        |
        | MacBook Pro |
      When 管理者 "Admin" 查詢商品列表
        | status |
        | draft  |
      Then 商品列表應包含以下商品
        | name        | status |
        | MacBook Pro | draft  |
