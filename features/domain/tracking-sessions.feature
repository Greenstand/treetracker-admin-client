@ndm @acceptance_spec @manual
Feature: Tracking session directory and review navigation
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-SES-001 @implemented
  Scenario: Show scoped session metadata and compact times
    Given an organization has linked Field Data sessions
    When its user opens Tracking sessions
    Then grower, organization, project, capture count and review state are displayed
    And timestamps use UTC with year-month-day and hour-minute precision
    And capture span duration is shown when available
    And IDs used only as secondary labels are abbreviated

  @UC-SES-002 @implemented
  Scenario: Search, sort and page sessions
    Given several authorized sessions exist
    When the user searches by grower, organization, project or session UUID and sorts a supported column
    Then matching sessions are returned in the requested order and page

  @UC-SES-003 @implemented
  Scenario: Show verified, pending and unavailable review information accurately
    Given sessions contain raw and processed captures with different review information
    When review status is displayed
    Then approved copies are not counted twice by capture UUID
    And unavailable review states are explicit
    And a processed capture without a raw review state is not falsely marked as reviewed

  @UC-SES-004 @implemented
  Scenario: Enter session verification from the list
    Given a user can verify captures
    When the user chooses Verify session
    Then Verify opens restricted to that session
    And the complete session ID and whole-session statistics are available above the decision panel

  @UC-SES-005 @implemented
  Scenario: Open bounded capture details
    Given a session contains more than one thousand captures
    When the user opens View captures
    Then the detail view clearly states that it shows the first one thousand
    And image and location information are available for authorized captures
