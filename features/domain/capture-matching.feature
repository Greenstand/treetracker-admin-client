@ndm @acceptance_spec @manual
Feature: Capture matching handoff
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-MATCH-001 @implemented
  Scenario: Record a matching event as part of approval
    Given an approved capture needs downstream matching
    When the verification transaction commits
    Then one raised CaptureCreated event contains the NDM capture identity and required payload
    And the capture remains explicitly unmatched until matching assigns a real tree

  @UC-MATCH-002 @pending
  Scenario: Publish approved events and reconcile matching safely
    Given a raised capture event has not been published
    When the matching publisher processes it
    Then the event reaches the capture-created queue without legacy tree creation
    And retries do not create duplicate trees or capture associations
    And the panel eventually reflects the real matching outcome
