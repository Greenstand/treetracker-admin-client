@ndm @acceptance_spec @manual
Feature: Grower directory and account details
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-GR-001 @implemented
  Scenario: Search and display NDM growers
    Given Organization A has growers through primary ownership, current project assignments or organization sessions
    When a user searches the Growers list
    Then matching growers appear once with mugshot, contact information and review counts
    And registration dates in the list have no time component

  @UC-GR-002 @implemented
  Scenario: Open full grower account details
    Given a grower is visible in the current organization
    When the user opens the grower's name
    Then the account shows available profile, wallet, registration and contact details
    And it shows the last uploaded app version when available
    And unavailable optional values are not fabricated

  @UC-GR-003 @implemented
  Scenario: Distinguish enrollment from session-based project activity
    Given a grower has a current assignment, a former assignment and a project observed only through sessions
    When the grower account is opened
    Then those association types are distinguished
    And organization membership alone does not invent project enrollment

  @UC-GR-004 @implemented
  Scenario: List a grower's sessions and verification progress
    Given a grower has sessions containing approved, rejected, pending or unavailable review states
    When the user opens the account's session history
    Then session review states and capture counts are shown
    And the user can open the applicable session workflows

  @UC-GR-005 @implemented
  Scenario: Open accounts consistently from related views
    Given a grower name appears in Tracking sessions, a project or an organization's grower list
    When an authorized user selects that grower
    Then the same scoped account view opens
    And a foreign grower requested directly is refused before private detail queries

  @UC-GR-006 @implemented
  Scenario: Retain historical association after an organization transfer
    Given a grower has historical sessions owned by Organization A and current membership in Organization B
    When Organization A reviews its historical grower/session association
    Then historical ownership is retained
    And the transfer is not presented as rewriting past captures

  @UC-GR-007 @implemented
  Scenario: Open session verification from the grower profile
    Given a grower profile lists a session containing captures
    And the viewer can verify captures
    When the viewer selects Verify session next to its review status
    Then the profile closes and Verify opens with that exact session UUID selected
    And an unassigned session explains that organization allocation is required before approval

  @UC-GR-008 @implemented
  Scenario: Open the grower profile from session verification
    Given a verification session has a linked grower account
    When the viewer selects Grower profile next to the grower name
    Then the linked account opens without losing the selected verification session
    And closing the profile returns to that session
    And a session without a linked grower does not offer a broken profile link
