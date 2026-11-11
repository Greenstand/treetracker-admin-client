Feature: Grower Page
  The grower page is open to Greenstand admins and to organization users.
  An organization user sees the growers under their own organization.

  Scenario: Organization user can use the grower page
    Given I am an organization user
    And the grower "S U" belongs to this organization
    And I am on the home page
    Then I should be able to see the "Growers" menu item
    When I click on the "Growers" menu item
    Then I should be able to see the grower list page
    And on the growers page, there is the grower "S U"

  Scenario: Greenstand admin can use the grower page
    Given I am a greenstand admin user
    And I am on the home page
    Then I should be able to see the "Growers" menu item
    When I click on the "Growers" menu item
    Then I should be able to see the grower list page
