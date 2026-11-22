@ndm @acceptance_spec @manual
Feature: Organization and platform dashboard
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-DASH-001 @implemented
  Scenario: Show scoped dashboard activity
    Given Organization A has projects, growers, active processed captures and tracking sessions
    When its member opens Dashboard
    Then the dashboard shows Organization A's counts for those resources
    And recent capture uploads show the grower, UTC timestamp and matching state
    And Organization B's activity is excluded

  @UC-DASH-002 @implemented
  Scenario: Review the platform overview
    Given a platform administrator has selected all organizations
    When the administrator opens Dashboard
    Then the overview contains platform-wide domain counts
    And selecting one organization refreshes counts and activity for that organization

  @UC-DASH-003 @implemented
  Scenario: Navigate from a dashboard metric
    Given a user is viewing Dashboard
    When the user chooses Manage projects, View growers, View captures or View sessions
    Then the corresponding view opens with the current organization context

  @UC-DASH-004 @implemented
  Scenario: Distinguish an empty dashboard from a failed request
    Given an organization's dashboard request succeeds with no recent captures
    When Dashboard is displayed
    Then the recent activity section reports no recent captures
    But if the request fails an error and retry action are shown

  @UC-DASH-005 @pending
  Scenario: Align all dashboard metrics with total-managed quota definitions
    Given quota usage includes pending and rejected managed captures
    When dashboard and subscription usage are compared
    Then each metric documents whether it counts processed captures or total managed captures
    And the dashboard offers the agreed total-managed metric without silently relabelling processed counts
