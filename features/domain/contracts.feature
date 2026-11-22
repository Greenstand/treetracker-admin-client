@ndm @acceptance_spec @manual
Feature: Contracts and authorized documents
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-CON-001 @implemented
  Scenario: Read organization contracts and their payment information
    Given a user has view_contracts for Organization A
    When the user searches and pages Contracts
    Then matching agreements show worker, organization, status and available payment rates
    And the detail view includes description, notes and signing information when available

  @UC-CON-002 @implemented
  Scenario: Open only listed authorized documents
    Given a contract has listed document versions and an authorized document URL
    When the user opens its details
    Then document names and versions are displayed
    And an Open document action is offered for a supported URL
    And a successful empty document result is distinguished from a failed request

  @UC-CON-003 @implemented
  Scenario: Refuse unauthorized contract and document access
    Given a user lacks view_contracts or requests a contract outside their organization
    When the list or document API is requested directly
    Then private agreements and documents are not returned

  @UC-CON-004 @pending
  Scenario: Create, sign and pay contracts through owning workflows
    Given contract creation, signing and payout integrations have been agreed
    When a user performs those actions from the new admin views
    Then the owning services authorize and audit each action
    And reading a contract alone never signs it or initiates payment
