Feature: Species Management
  Species belong to Greenstand, not to any one organization.

  Scenario: Admin user manage species
    Given I am the user with role "greenstand-admin"
    And I login
    Then I should be able to see the "Species" menu item
    When I click on the "Species" menu item
    Then I should see the species page

  Scenario: Org user can not manage species
    Given I am the user with role "organization"
    And I login
    Then I should not see the "Species" menu item
    And opening the species page directly should be refused
