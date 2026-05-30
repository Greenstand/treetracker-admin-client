Feature: Admin

  Scenario: Admin can log in
    Given I am on the admin login page
    And I am the user with role "greenstand-admin"
    When I login 
    Then I should be able to see the "organization management" menu item
    When I click on the "organization management" menu item
    Then I should be able to see the organization list page
