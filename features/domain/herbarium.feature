@ndm @acceptance_spec @manual
Feature: Platform Herbarium catalogue and botanical identity
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-HERB-001 @implemented
  Scenario: Search and maintain the global catalogue
    Given a platform administrator opens Herbarium
    When they search, add or edit a species and save a current version
    Then catalogue values persist in the herbarium schema
    And common names, morphology, description, default-list setting and visibility are available

  @UC-HERB-002 @implemented
  Scenario: Hide a species without destroying historical references
    Given a species has historical capture or selection references
    When a platform administrator hides it from new selections
    Then it is excluded from ordinary new choices
    And existing references remain intact
    And the Show hidden control allows catalogue maintenance

  @UC-HERB-003 @implemented
  Scenario: Distinguish Greenstand and external reference links
    Given a species has Greenstand herbarium and external references
    When its sources are displayed
    Then Greenstand links use the Greenstand logo and external links use a globe icon
    And supported links open safely without substituting invalid URLs

  @UC-HERB-004 @implemented
  Scenario: Separate the herbarium name from the Latin name
    Given a catalogue species has Greenstand herbarium name "ACROFRAX" and Latin name "Acrocarpus fraxinifolius"
    When a platform administrator edits the species
    Then the herbarium name and Latin name have independent fields
    And both are separately visible and searchable
    And common and local names remain separate concepts

  @UC-HERB-005 @implemented
  Scenario: Preserve existing species identities while splitting imported names
    Given an imported catalogue value combines a herbarium code and common name
    When botanical identity fields are migrated
    Then species UUIDs and capture/selection references are preserved
    And known codes are retained
    And missing Latin names are not invented from common names or abbreviations
    And normalization has a reviewable source and rollback record

  @UC-HERB-006 @implemented
  Scenario: Prevent organization users from modifying the global Herbarium
    Given an organization member can allocate species for their organization
    When they request a global catalogue create or edit operation
    Then the server refuses the platform-only write
    And no global species values are changed

  @UC-HERB-007 @implemented
  Scenario: Keep a historical code when the Latin name changes
    Given a species has a historical herbarium code and an updated Latin name
    When the administrator changes its Latin name
    Then the existing code remains unchanged
    And an eight-letter suggestion is applied only when explicitly chosen

  @UC-HERB-008 @implemented
  Scenario: Validate the independent herbarium code
    Given a platform administrator saves a species
    When its supplied herbarium code is not exactly eight letters or duplicates another species code
    Then the save is rejected
    And the existing catalogue remains unchanged
