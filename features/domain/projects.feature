@ndm @acceptance_spec @manual
Feature: Project directory and project editor
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-PROJ-001 @implemented
  Scenario Outline: Search projects by supported business identifiers
    Given Organization A has a project matching "<field>"
    When the user searches the Projects list for that value
    Then matching organization-scoped projects are displayed
    And the list returns to its first page
    Examples:
      | field             |
      | organization name |
      | code              |
      | project name      |
      | country           |

  @UC-PROJ-002 @implemented
  Scenario: Sort and page the project directory
    Given several projects are visible
    When the user sorts a supported column and changes page size
    Then the requested order and page are displayed
    And country is included in the list

  @UC-PROJ-003 @implemented
  Scenario: Create a project with separate targets and empty species allocation
    Given a project manager belongs to Organization A
    When the manager creates a project with a unique code, name, country and separate tree and capture targets
    Then the project is owned by Organization A
    And tree and capture targets retain their separate values
    And the new project's custom species list is explicitly empty

  @UC-PROJ-004 @implemented
  Scenario: Edit project description and image URLs
    Given a project manager opens an existing project
    When the manager saves its description, logo URL and hero image URL
    Then the saved values appear when the editor is reopened
    And a blank project logo uses the organization's logo

  @UC-PROJ-005 @implemented
  Scenario: Reject invalid or stale project edits
    Given a project has been changed since an editor was opened
    When a user saves that stale version
    Then the save is refused with a refresh instruction
    And the newer values remain intact
    And invalid dates, negative targets and duplicate organization codes are rejected

  @UC-PROJ-006 @implemented
  Scenario: Link project editing to species and grower management
    Given a user is viewing a saved project
    When the user opens Manage species or Manage growers
    Then the matching project and organization scope are carried into that workflow

  @UC-PROJ-007 @implemented
  Scenario: Restrict project writes to project managers
    Given a verification-only member can read their organization's projects
    When that member attempts to create or edit a project through the API
    Then the operation is refused without changing project data

  @UC-PROJ-008 @pending
  Scenario: Upload project image files to managed storage
    Given a project manager has a local logo or hero image file
    When the manager uploads it through the project editor
    Then the file is stored through the agreed media service
    And the saved project references the resulting authorized image URL
