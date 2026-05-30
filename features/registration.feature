Feature: Registration

  Scenario: I can register a new account by email address
    Given I am on the login page
    When I open the registration page
    And I fill in unique registration details
    And I submit the registration form
    Then I should be redirected away from the login page

  @skip
  @manual
  Scenario: I can register a new account by social media account Google
    # Manual demo: reports-manual/github-google-oauth-keycloak.mp4

  @skip
  @manual
  Scenario: I can register a new account by social media account GitHub
    # Manual demo: reports-manual/github-google-oauth-keycloak.mp4
