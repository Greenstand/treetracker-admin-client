@ndm @acceptance_spec @manual
Feature: Platform organization management
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-ORG-001 @implemented
  Scenario: Search and maintain Stakeholder organizations
    Given a platform administrator opens Organizations
    When they search by organization name, email or phone and page or sort supported columns
    Then Stakeholder organizations and project counts are shown
    And the administrator can add or edit organization details

  @UC-ORG-002 @implemented
  Scenario: Reject stale or unauthorized organization writes
    Given an organization was edited after a form was opened
    When the stale version is saved
    Then the newer record remains intact and the edit is rejected
    And organization-only users cannot create or edit platform organizations through direct requests

  @UC-ORG-003 @implemented
  Scenario: Show growers associated with the edited organization
    Given an organization has growers through primary membership, projects or scoped sessions
    When a platform administrator edits that organization
    Then an associated-grower list includes mugshots, names, contacts and capture counts
    And the association type is explained
    And search and grower account details use the edited organization's scope rather than an unrelated toolbar selection

  @UC-ORG-004 @implemented
  Scenario: Keep new organization identity in the NDM
    Given a platform administrator creates a new organization
    When creation succeeds
    Then its identity is a Stakeholder UUID
    And no legacy public entity is created as a side effect
    And workflows requiring an existing numeric mobile/Keycloak mapping report it as missing until configured
