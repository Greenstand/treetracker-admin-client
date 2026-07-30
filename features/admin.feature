Feature: Admin

  Scenario: Admin can log in
    Given I am on the admin login page
    And I am the user with role "greenstand-admin"
    When I login
    Then I should be able to see the "Organizations" menu item
    When I click on the "Organizations" menu item
    Then I should be able to see the organization list page
    And I search for organizations with "m"
    Then I should see organizations matching "m"
    And I sort organizations by "Newest"
    Then the organization list should update with the new sort order


  Scenario: Admin can verify all trees
    Given I am the user with role "greenstand-admin"
    And I login
    And I am on the verify page
    Then There should be trees/captures on the list
    And I should be able to verify the first tree
