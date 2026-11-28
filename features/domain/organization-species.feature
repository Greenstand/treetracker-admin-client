@ndm @acceptance_spec @manual
Feature: Organization and project species selections
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-SP-001 @implemented
  Scenario: Resolve project, organization and default inheritance
    Given a project has no custom species scope
    When its species selection is viewed
    Then it inherits the organization selection or the visible default catalogue
    And the effective source is shown

  @UC-SP-002 @implemented
  Scenario: Keep new project selections explicitly empty
    Given a project was created through the domain API
    When its species allocation is opened before any selection is saved
    Then all species are unselected
    And this explicit empty custom scope does not inherit every default species

  @UC-SP-003 @implemented
  Scenario: Select all matching species across pages and save deliberately
    Given an authorized species manager has searched the catalogue
    When they choose Select all
    Then every matching page is included in the draft selection
    And Unselect all clears the complete draft scope
    And changes persist only after Save selection succeeds

  @UC-SP-004 @implemented
  Scenario: Restore inheritance explicitly
    Given a project or organization has a custom selection, including an empty one
    When an authorized manager chooses its parent/default-list action
    Then the custom override is removed explicitly
    And effective species are resolved from the parent or visible defaults

  @UC-SP-005 @implemented
  Scenario: Select existing names and add an organization-local alias
    Given a species has catalogue common names and organization-local names
    When a manager chooses a listed name or adds one with the plus action and saves
    Then the selected alias and newly entered options are persisted transactionally
    And the organization-local name is reusable in that organization
    And another organization's local names are excluded

  @UC-SP-006 @implemented
  Scenario: Keep project allocation changes isolated
    Given Projects A1 and A2 have separate custom lists
    When a manager changes A1's species or selected local names
    Then A2's custom list is unchanged
    And the global catalogue is not renamed

  @UC-SP-007 @implemented
  Scenario: Reject unauthorized, foreign-project or stale selection changes
    Given a user lacks manage_species or supplies a foreign project or stale scope version
    When the selection API is called directly
    Then the change is rejected without a partial selection or name-library update

  @UC-SP-099 @implemented
  Scenario: Verification offers only effective allocated species
    Given an organization or project has a saved species allocation
    When a verifier opens the species dropdown
    Then it offers only the effective project, organization or default allocation
    And an explicitly empty custom allocation offers no species
    And a mixed-project batch offers only species allowed in every scope
    And the server rejects an out-of-allocation species submitted directly
