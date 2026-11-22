@ndm @acceptance_spec @manual
Feature: Organization capture tags and project suggestions
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-TAG-001 @implemented
  Scenario: Suggest and reuse existing organization tags
    Given Organization A has previously used active tags
    When its verifier types into Additional tags
    Then matching authorized names are suggested
    And choosing an existing name reuses it case-insensitively on successful approval

  @UC-TAG-002 @implemented
  Scenario: Create a private organization tag only when approval succeeds
    Given a verifier enters a new text tag
    When approval succeeds
    Then a private tag owned by the capture's Stakeholder organization is created or reused
    And capture_tag links refer to that organization's tag
    And typing or selecting a suggestion alone does not write a tag
    And text still being typed is included when the review is submitted

  @UC-TAG-003 @implemented
  Scenario: Exclude another organization's tags even if marked public
    Given Organization B has a tag with the same name as one Organization A wants to use
    When Organization A searches for or applies that name
    Then Organization B's tag is not disclosed or attached
    And Organization A uses its own private dictionary entry

  @UC-TAG-004 @implemented
  Scenario: Offer only proven organization usage of a legacy unowned public name
    Given an unowned public tag has been used on Organization A's active NDM captures
    And another unowned public name has only been used elsewhere
    When Organization A searches its dictionary
    Then the proven name may be suggested
    And the unrelated global name is excluded
    And reusing the proven name creates or reuses an organization-owned entry

  @UC-TAG-005 @implemented
  Scenario: Narrow suggestions by project without changing ownership
    Given Organization A has several projects using different tags
    When a verifier selects Suggest tags used in this project
    Then suggestions are restricted to usage on that project's session captures
    And tags remain organization-owned and reusable across projects
    And a project outside the organization is refused

  @UC-TAG-006 @implemented
  Scenario: Prevent unscoped or carried-over tag suggestions
    Given no single organization is selected or represented by the current captures
    When the tag picker is displayed
    Then it does not request an all-organization dictionary
    And choosing a different organization clears selected and pending tag text
    And platform callers must also provide one authorized organization to list tags
