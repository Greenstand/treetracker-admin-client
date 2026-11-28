@ndm @acceptance_spec @manual
Feature: Grower assignment to projects and its trail
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-PG-001 @implemented
  Scenario: Assign an eligible grower to a project
    Given an active project in Organization A and a grower with active membership in Organization A
    And a project manager opens Manage growers
    When the manager assigns the grower and supplies a reason
    Then the project has an active grower membership
    And the trail records the grower, project, real actor, UTC time and reason

  @UC-PG-002 @implemented
  Scenario: Permit one grower to join several projects
    Given a grower is assigned to Project A1
    When an authorized manager assigns the grower to Project A2 in the same organization
    Then both memberships are active
    And no existing sessions are moved between projects

  @UC-PG-003 @implemented
  Scenario: Remove and reassign without losing the trail
    Given a grower has an active project membership
    When a manager removes it with a reason and later reassigns the grower with another reason
    Then removal ends the old membership interval
    And reassignment starts a new interval
    And both changes remain visible in the trail
    And historical sessions and captures remain unchanged

  @UC-PG-004 @implemented
  Scenario: Reject a session-only or foreign-organization candidate
    Given a grower is linked to Organization A only through a past session or belongs to Organization B
    When a manager attempts a new assignment in Organization A
    Then the server requires valid organization membership
    And no assignment or successful audit event is created

  @UC-PG-005 @implemented
  Scenario: Reject stale membership edits and replay identical requests once
    Given another manager has changed a grower's project membership
    When a stale membership change is submitted
    Then it is rejected
    But an identical retry of a completed request returns its existing outcome
    And no duplicate membership event is created

  @UC-PG-006 @implemented
  Scenario: Record project closures caused by organization transfers
    Given a grower has active memberships in their old primary organization's projects
    When a platform administrator transfers the grower to another organization
    Then each closed membership has a removal event linked to the transfer reason and actor
    And the source is identified as an organization transfer

  @UC-PG-007 @implemented
  Scenario: Retain the distinction between old dates and recorded audit history
    Given a membership existed before the audit feature
    When a manager views its trail
    Then its existing membership dates remain visible
    And no historical actor or reason is invented
