@ndm @acceptance_spec @manual
Feature: Hosted Stripe Checkout and billing portal
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-BILL-001 @implemented
  Scenario: Start the first organization subscription
    Given an approved organization has no current Stripe customer subscription
    When its administrator chooses a configured tier
    Then the server creates or resolves the organization customer using approved metadata
    And a hosted Checkout URL is returned
    And payment confirmation is performed on Stripe

  @UC-BILL-002 @implemented
  Scenario: Change an existing subscription through the portal
    Given an organization already has one recognized subscription
    When its administrator chooses another tier
    Then the billing portal confirmation flow targets the configured price
    And the organization linkage is preserved

  @UC-BILL-003 @implemented
  Scenario: Reuse a matching pending checkout and block ambiguity
    Given a matching pending checkout exists for the organization and tier
    When the administrator starts the same operation again
    Then the pending operation is reused safely
    And conflicting pending tiers, multiple customers or multiple subscriptions require reconciliation

  @UC-BILL-004 @implemented
  Scenario: Refuse unauthorized scope or an invalid hosted destination
    Given a caller lacks organization billing authority or supplies another organization's scope
    When a billing operation is requested
    Then the server refuses the operation
    And the client follows only an HTTPS checkout.stripe.com or billing.stripe.com result

  @UC-BILL-005 @implemented
  Scenario: Distinguish billing failure from a successful subscription
    Given Stripe credentials, price access or portal configuration are unavailable
    When billing is requested
    Then an actionable billing error is displayed
    And a manually assigned Keycloak subscriber role does not create or prove a Stripe subscription
