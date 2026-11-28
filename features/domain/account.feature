@ndm @acceptance_spec @manual
Feature: Account identity and authentication details
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-ACCT-001 @implemented
  Scenario: Show the actual login identity
    Given a Keycloak-authenticated user opens Account
    Then the account shows their login name, available name, email and roles
    And the available Keycloak creation timestamp is displayed
    And missing account metadata is not invented

  @UC-ACCT-002 @implemented
  Scenario: Use Keycloak for profile and password actions
    Given Keycloak authentication is enabled
    When the user chooses Update account or Change password
    Then the corresponding Keycloak required action opens
    And the legacy admin-password mutation is not used for that identity

  @UC-ACCT-003 @implemented
  Scenario: Sign out through the identity session
    Given an authenticated user is viewing Account or the shared toolbar
    When the user signs out
    Then the local authenticated state is cleared and the configured identity logout is used
    And reopening a protected view requires authentication

  @UC-ACCT-004 @pending
  Scenario: Embed organization subscription and richer login-session information in My account
    Given an organization administrator opens My account
    When the agreed account information integration is complete
    Then their organization's actual tier/status and available login-session details are displayed
    And missing identity-provider information remains unavailable rather than fabricated
