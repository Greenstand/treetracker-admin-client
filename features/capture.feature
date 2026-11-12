Feature: Capture Page
  The capture page is open to Greenstand admins and to organization users.
  An organization user asks the admin api only for their own organization's
  captures, so the list they see is scoped to that organization.

  Scenario: Greenstand admin can use the capture page
    Given I am a greenstand admin user
    And I am on the home page
    Then I should be able to see the "Captures" menu item
    When I click on the "Captures" menu item
    Then I can see the capture page
    And the capture request covers the whole platform

  Scenario: Organization user can use the capture page
    Given I am an organization user
    And I am on the home page
    Then I should be able to see the "Captures" menu item
    When I click on the "Captures" menu item
    Then I can see the capture page
    And the capture request is scoped to my organization
