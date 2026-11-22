@ndm @acceptance_spec @manual
Feature: Organization binding requests
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-BIND-001 @legacy_contract
  Scenario: Review and decide retained organization binding requests
    Given a platform administrator has pending binding requests
    When Org binding opens
    Then usernames and requested organizations are listed with pagination
    And approving or rejecting a request uses the existing binding service
    And success refreshes the pending list while failure is reported

  @UC-BIND-002 @legacy_contract
  Scenario: Distinguish no requests from a failed directory request
    Given a successful binding query returns no pending requests
    When the view opens
    Then it reports No pending requests
    But a failed query displays a load error rather than a successful empty queue

  @UC-BIND-003 @pending
  Scenario: Enrich binding requests with optional contact and location data
    Given a request contains a phone number or email and optional location metadata
    When the richer binding view is implemented
    Then available contact and location details assist the platform decision
    And missing optional fields are labelled unavailable without inventing values

  @UC-BIND-004 @pending
  Scenario: Complete NDM binding ownership and decision auditing
    Given binding integration is migrated to agreed Stakeholder ownership
    When a platform administrator decides a binding request
    Then identity membership is reconciled through the owning service
    And the decision records its real actor, time and reason under the agreed audit model
    And no legacy entity ownership is silently substituted
