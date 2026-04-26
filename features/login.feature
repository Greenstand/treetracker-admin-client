Feature: Login

  @skip
  Scenario: Login with wrong credentials shows an error message
    Given I am on the login page
    When I enter username "admin" and password "wrongpwd"
    And I click the login button
    Then I should see an error message

  @skip
  Scenario: Login with valid credentials succeeds
    Given I am on the login page
    When I enter username "user-test-treetracker-admin-client" and password "LjyxVk4t5^yx&!Gl"
    And I click the login button
    Then I should be redirected away from the login page
