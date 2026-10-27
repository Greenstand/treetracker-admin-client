Feature: Org Binding, rejected
  What a user sees when an admin turns the request down.

  Scenario: New user binds to an existing organization but is rejected
    Given I am the user with role "registered-user"
    And I login
    When I click the request to bind link
    And I choose the organization "test-org-01" and submit
    Then I should see that the request is pending
    Given I log out
    And I am the user with role "greenstand-admin"
    And I login
    When I open the organization management page
    Then I should see the binding request from the user
    When I reject the binding request
    Given I log out
    And I am the user with role "registered-user"
    And I login
    Then I should see the request to bind link on the home page
    When I click the request to bind link
    Then I should see that the request was rejected
