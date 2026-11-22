@ndm @acceptance_spec @manual
Feature: Access, organization context and navigation
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-ACC-001 @implemented
  Scenario: Resolve approved organization membership
    Given an organization member has the approved numeric Keycloak organization ID for Organization A
    When the member signs in to the admin panel
    Then the domain context resolves to Organization A's Stakeholder UUID
    And organization-scoped requests use that approved organization

  @UC-ACC-002 @implemented
  Scenario: Reject a forged organization selection
    Given a member belongs to Organization A
    When the member requests Organization B through a changed URL or request payload
    Then the server refuses the request
    And no Organization B records are returned or changed

  @UC-ACC-003 @implemented
  Scenario: Require organization selection for scoped platform actions
    Given a platform administrator is viewing all organizations
    When the administrator attempts an action requiring one organization
    Then the interface asks for an organization selection
    And no organization-specific change occurs before a valid selection

  @UC-ACC-004 @implemented
  Scenario: Enter organization preview without impersonating another user
    Given a platform administrator selects Organization A through the Org user control
    When the organization preview opens
    Then organization views use Organization A
    And platform navigation is hidden in the preview
    And the preview is labelled as an administrator preview
    And the real authenticated administrator remains the actor for audit entries

  @UC-ACC-005 @implemented
  Scenario: Prevent a member from elevating privileges through the toolbar
    Given an ordinary organization member is signed in
    When the member views the toolbar or directly requests a platform-only API
    Then the Admin control cannot grant platform privileges
    And the server refuses platform-only operations

  @UC-ACC-006 @implemented
  Scenario: Apply a changed organization claim after fresh authentication
    Given an administrator changed a user's approved Keycloak organization from A to B
    When the user signs out and signs in with a fresh token
    Then the panel resolves Organization B
    And the change does not transfer growers, historical captures or Stripe customers

  @UC-ACC-007 @implemented
  Scenario: Display grouped navigation and account controls
    Given a platform administrator is signed in
    When the sidebar and toolbar are displayed
    Then Growers appears before Verify and Tracking sessions
    And organization tools are separated from Greenstand Admin tools
    And Account is separated below administrative tools
    And settings, account and sign-out controls are available

  @UC-ACC-008 @implemented
  Scenario: Refuse missing or ambiguous membership
    Given an organization user has no approved mapping or the mapping resolves ambiguously
    When the user opens a domain view
    Then an organization-access error is displayed
    And the panel does not choose an arbitrary organization
