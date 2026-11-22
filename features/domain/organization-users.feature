@ndm @acceptance_spec @manual
Feature: Organization users and permission grants
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-MEM-001 @implemented
  Scenario: List approved organization members separately from growers
    Given approved Keycloak users belong to Organization A
    When an authorized user opens Organization users
    Then the directory lists their login identity, enabled state and organization permissions
    And a grower account is not assumed to be an admin login

  @UC-MEM-002 @implemented
  Scenario: Grant scoped capabilities to an existing member
    Given a membership manager is editing an approved ordinary member in Organization A
    When the manager selects valid project, species, contract, verification or member-management capabilities and saves
    Then the scoped grant records its authenticated updater and version
    And default ordinary-member access is verification when no explicit grant exists

  @UC-MEM-003 @implemented
  Scenario: Prevent editing foreign members or reducing administrator capabilities
    Given a target belongs to Organization B or is an organization administrator
    When Organization A's manager attempts to change the target's scoped permissions
    Then the request is rejected
    And an organization administrator retains their administrator capabilities

  @UC-MEM-004 @implemented
  Scenario: Reject unknown permissions and stale grants
    Given a grant changed after its editor was opened
    When an old version or unsupported permission value is submitted
    Then no grant is overwritten
    And the manager is instructed to refresh

  @UC-MEM-005 @implemented
  Scenario: Report directory access failure without fabricating an empty membership list
    Given the backend Keycloak directory credential is unavailable or unauthorized
    When the organization user directory is loaded
    Then a service error is presented
    And it is not reported as a successful empty organization

  @UC-MEM-006 @pending
  Scenario: Invite a new administrative login into an organization
    Given the organization has permission and an agreed available admin-seat allowance
    When an administrator invites a new admin login
    Then the invitation and approved binding use their owning identity workflow
    And permissions are assigned only after membership is validated
