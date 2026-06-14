Feature: Forgot Password

  Scenario: I can reset my password by email address
    Given I am on the login page
    When I open the forgot password page
    And I fill in my email address
    And I submit the forgot password form
    Then I should see a confirmation message that a password reset email has been sent


