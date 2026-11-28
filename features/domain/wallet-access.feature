@ndm @acceptance_spec @manual
Feature: Wallet entry points and subscription integration
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-WAL-001 @legacy_contract
  Scenario: Retain wallet-role access and menu placement
    Given a user has the existing wallet-admin capability
    When the sidebar is displayed
    Then Wallets is available in its retained workflow group below Captures
    And users without that capability are not granted it by the organization-preview switch

  @UC-WAL-002 @legacy_contract
  Scenario: Retain existing wallet operations under their owning API
    Given a wallet administrator opens an authorized wallet
    When they use an existing wallet workflow
    Then the established wallet service and permissions apply
    And the domain project changes do not silently rewrite wallet ownership or initiate payment

  @UC-WAL-003 @pending
  Scenario: Apply approved subscription wallet entitlement alongside permissions
    Given wallet access policy for subscription tiers has been approved
    When an organization user requests wallet capabilities
    Then both the user's required wallet permission and the organization's entitlement are checked
    And a proposed plan flag alone does not grant wallet authority
