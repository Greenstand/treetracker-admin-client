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

  @UC-CON-005 @implemented
  Scenario: Create an individual unsigned contract using shared agreement terms
    Given an organization administrator selects their organization
    And an open agreement and active project belong to that organization
    When they select a grower in that organization and set a positive capture quota and reason
    Then an unsigned contract references that project, grower and agreement
    And the quota is stored on the individual contract
    And creation records the actor and reason in the contract history

  @UC-CON-006 @implemented
  Scenario: Record manual mobile-money verification without sending money
    Given a Greenstand administrator has checked the registered recipient name using a test payment
    When they record the provider, account reference, transaction reference, check date and review outcome
    Then an immutable review entry records their identity and time
    And no payment, capture approval or contract signature is performed
    And organization users cannot read or record these private verification details

  @UC-CON-007 @implemented
  Scenario: Gate signing and preserve the beta contract lifecycle
    Given an unsigned project contract has a grower and positive quota
    When an authorized administrator records a signed status
    Then the latest worker review must be approved
    And signing records its verification reference and signing time
    And signed contracts can only become completed or cancelled
    And unsigned contracts can alternatively become aborted
    And stale status updates are refused without changing the contract
    And every successful status change records its actor and reason atomically

  @UC-CON-008 @implemented
  Scenario: Browse shared agreements separately from individual contracts
    Given a user has view_contracts for their organization
    When they switch to the Agreements tab
    Then agreements show shared payment terms, default quota, status and individual contract count
    And the detail view shows the earnings calculation rule and lifecycle dates
    And no agreement is opened or contract signed by browsing
