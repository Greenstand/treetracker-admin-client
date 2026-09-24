Feature: Wallet Admin

  @skip
  Scenario: Can list all wallets
    Given I am on the admin login page
    And I am the user with role "wallet-admin"
    When I login
    Then I should be able to see the "Wallets" menu item
    When I click on the "Wallets" menu item
    Then I should be able to see the wallet list page
