Feature: Login

  Scenario: Login with wrong credentials shows an error message
    Given I am on the login page
    When I enter username "treetracker-bdd-no-such-user" and password "wrongpwd"
    And I click the login button
    Then I should see an error message

  Scenario: Login with a newly registered account succeeds
    Given I am registered as a new user
    And I am logged out
    And I am on the login page
    When I login with the registered account
    Then I should be redirected away from the login page
