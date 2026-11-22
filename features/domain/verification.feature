@ndm @acceptance_spec @manual
Feature: NDM capture approval and rejection
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-VER-001 @implemented
  Scenario: Review the awaiting-verification queue
    Given authorized unprocessed raw captures exist
    When a verifier opens Verify
    Then images, grower, organization, capture time and current status are displayed
    And already processed captures are not presented as eligible for another approval

  @UC-VER-002 @implemented
  Scenario: Filter and inspect captures
    Given the verifier is viewing a queue
    When they search, apply capture-date filters or change verification status
    Then matching captures are displayed
    And Reset filters restores the awaiting-verification filter
    And the verifier can change image size, enlarge an image and inspect capture/grower/location/session-map details

  @UC-VER-003 @implemented
  Scenario: Select a page or a shift-click range
    Given several reviewable captures appear on one page
    When the verifier selects a range with shift-click or selects the page
    Then only reviewable captures on that page are selected
    And the selection count and highlighting agree
    And Select none clears the selection

  @UC-VER-004 @implemented
  Scenario: Approve captures with explicit annotations
    Given a verifier selects captures with valid linked growers, devices and coordinates
    When they submit morphology, age, an optional species and optional text tags
    Then all selected captures are approved atomically in the NDM
    And one reviewer audit and one raised CaptureCreated event exist per capture
    And no legacy tree or entity write is made

  @UC-VER-005 @implemented
  Scenario: Reject captures with a reason
    Given a verifier selects reviewable captures
    When they choose a rejection preset or enter a reason and submit
    Then each capture is rejected with that reason and the authenticated reviewer recorded
    And no approved capture or matching event is created
    And a missing reason prevents submission

  @UC-VER-006 @implemented
  Scenario: Prevent incomplete-metadata approvals
    Given a reviewable capture lacks a linked grower, device or valid capture location
    When a verifier selects it
    Then approval is unavailable and the missing-metadata state is shown
    And the capture may still be rejected with a reason

  @UC-VER-007 @implemented
  Scenario: Roll back a stale batch and replay a completed batch safely
    Given one capture in a selected batch changed after selection
    When the batch is submitted
    Then the whole batch is rejected without partial decisions, tags or audits
    But an identical retry of a previously completed batch returns the existing outcome once

  @UC-VER-008 @implemented
  Scenario: Retire legacy classification and remembered form choices
    Given a verifier opens the NDM decision panel
    Then the former leaf/tree classification choices and Remember form choices control are absent
    When a review succeeds
    Then morphology, age, species and text tag inputs reset
    And no hidden classification tag is added

  @UC-VER-009 @implemented
  Scenario: Give prompt feedback after batched persistence
    Given a verifier submits twenty-five captures with two text tags
    When persistence succeeds
    Then capture, tag, event and audit writes are batched rather than repeated per capture
    And success feedback is shown without waiting for background queue and summary refreshes
    And the benchmark environment and measured latency are recorded separately from a production SLA

  @UC-VER-010 @implemented
  Scenario: Do not present approval as completed tree matching
    Given a raw capture is approved
    When the result is shown
    Then the capture has no automatically invented tree association
    And matching is identified as pending publication/processing
