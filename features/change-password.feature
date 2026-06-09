Feature: Change Password

  Scenario: I can change my password
    Given I am logged in
    When I open the change password page
    And I fill in my current password
    And I fill in a new password
    And I confirm the new password
    And I submit the change password form
    Then I should see a confirmation message that my password has been changed
