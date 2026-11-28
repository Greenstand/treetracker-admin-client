@ndm @acceptance_spec @manual
Feature: Capture search and export
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-CAP-001 @legacy_contract
  Scenario: Filter and inspect the existing capture table
    Given an authorized user opens Captures
    When they apply available status, date, grower, capture, device, species, tag and organization filters
    Then matching rows and the active filter state are displayed under the retained service contract
    And Apply and Reset controls operate on the table filters

  @UC-CAP-002 @legacy_contract
  Scenario: Export selected columns under the retained contract
    Given a capture filter has been applied
    When the user opens Export Captures and selects columns
    Then the download contains the selected columns for the filtered records
    And the export's twenty-thousand-record cap is disclosed
    And cancellation does not start a download

  @UC-CAP-003 @pending
  Scenario: Complete the capture directory migration to NDM APIs
    Given an organization needs captures from the new domain model
    When Captures and its export are migrated
    Then capture identity, review status, grower, organization, project and coordinates come from NDM ownership
    And organization filters cannot be overridden to export another organization's data
    And pagination and export limits are applied consistently without duplicate raw/processed records

  @UC-CAP-004 @pending
  Scenario: Retire the legacy global tag endpoint from remaining capture filters
    Given the retained capture filters still request the legacy global tag catalogue
    When those filters migrate to organization capture tags
    Then only the organization's authorized dictionary is offered
    And no public-schema tag ownership is guessed or silently copied
