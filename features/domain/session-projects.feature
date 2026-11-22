@ndm @acceptance_spec @manual
Feature: Correcting a session project allocation
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-ALLOC-001 @implemented
  Scenario: Assign or correct a session project
    Given a project manager views a session in Organization A
    When the manager opens its project allocation, chooses an active project in Organization A and enters a reason
    Then the session's project is saved
    And its session-based capture reporting uses that project
    And the trail records previous and new project, actor, time and reason

  @UC-ALLOC-002 @implemented
  Scenario: Clear the project allocation
    Given a session currently belongs to a project
    When an authorized manager clears the allocation and supplies a reason
    Then the session becomes unassigned
    And the previous project remains in its trail

  @UC-ALLOC-003 @implemented
  Scenario: Reject cross-organization and stale allocation changes
    Given another manager has changed a session allocation
    When a stale expected project or audit-event version is submitted
    Then no correction is saved
    And changing away from and back to the original project still invalidates the old version
    And a project in another organization is rejected

  @UC-ALLOC-004 @implemented
  Scenario: Keep correction retries idempotent
    Given a correction was saved but its response was lost
    When the same actor retries the same request
    Then the existing correction is returned
    And a duplicate event is not created

  @UC-ALLOC-005 @implemented
  Scenario: Keep allocation independent of grower enrollment and review decisions
    Given a session contains reviewed captures and the grower has project memberships
    When the session project is corrected
    Then grower memberships, verification decisions and tree associations remain unchanged
    And an initial app allocation is retained as the previous value on the first correction without inventing its actor

  @UC-ALLOC-006 @pending
  Scenario: Receive the initial selected project from the mobile app
    Given a tracker belongs to several projects and explicitly selects Project A1 in the app
    When the app uploads a new session
    Then the Field Data contract accepts and validates the selected project against its organization
    And session creation retries preserve later administrative corrections
    And the backend does not choose an arbitrary project from grower memberships
