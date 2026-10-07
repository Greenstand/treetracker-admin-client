Feature: Wallet Admin

  Scenario: Can list all wallets
    Given I am on the admin login page
    And I am the user with role "wallet-admin"
    When I login
    Then I should be able to see the "Wallets" menu item
    When I click on the "Wallets" menu item
    Then I should be able to see the wallet list page

  Scenario: Link a legacy wallet to a keycloak account
    Given I am on the admin login page
    And I am the user with role "wallet-admin"
    And there is a wallet "wallet-legacy-01" with no keycloak binding
    When I login
    And I click on the "Wallets" menu item
    And I click the name of the wallet "wallet-legacy-01"
    Then I should see the wallet detail page for "wallet-legacy-01"
    And the keycloak id is empty
    When I open the bind keycloak account dialog
    And I search for a keycloak account and pick the first match
    Then the detail page shows the keycloak id and the account behind it
