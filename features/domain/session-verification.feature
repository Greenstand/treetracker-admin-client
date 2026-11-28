@ndm @acceptance_spec @manual
Feature: Session selection and verification statistics
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-VS-001 @implemented
  Scenario: Enter session verification from inside Verify
    Given a verifier is on the general verification screen
    When they choose Verify a session and search by grower, organization, project or complete session UUID
    Then they can select an authorized matching session without leaving Verify
    And Change session selects another session
    And All sessions removes the session restriction

  @UC-VS-002 @implemented
  Scenario: Show complete identity and whole-session statistics
    Given a verifier has selected a session
    When the right-hand decision panel is displayed
    Then the complete session UUID is visible above Selected captures
    And grower, organization, project, total, pending, approved and rejected counts are shown
    And the summary includes review progress, capture times, capture span and recorded area when available
    And counts describe the whole session rather than the current page or status filter

  @UC-VS-003 @implemented
  Scenario: Refresh statistics after review
    Given part of a session's captures have been selected
    When approval or rejection succeeds
    Then selection is cleared and the queue refreshes
    And session counts and progress refresh without double-counting approved copies

  @UC-VS-004 @implemented
  Scenario: Correct the project from the verification summary
    Given an authorized project manager is verifying a session
    When they choose Manage session project above the decision panel
    Then the same audited allocation workflow used by Tracking sessions opens
