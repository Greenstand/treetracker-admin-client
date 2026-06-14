Feature: Organization Features
  We allow user to apply for an organization, as an organization, user can approve or reject trees, manage grower under the org.
  Check the `docs/organization-onboarding.md` for more details.
  
  Scenario: Apply for an organization
    Given I am registered user
    And I am on the organization application page
    When I fill in the organization details
    And I submit the form
    Then I should see a confirmation message
    And Go the home page
    And I should see the `verify` menu item on the menu bar on the top left
