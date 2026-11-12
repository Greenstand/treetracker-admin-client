Feature: Update Account

  Scenario: I can update my account details
    Given I am logged in
    When I open the update account page
    And I fill in my current password
    And I fill in updated account details
    And I submit the update account form
    Then I should see a confirmation message that my account has been updated
