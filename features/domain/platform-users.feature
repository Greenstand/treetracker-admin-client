@ndm @acceptance_spec @manual
Feature: Platform SaaS organization-admin directory
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-SAAS-001 @implemented
  Scenario: List organization administrators and organization subscriptions
    Given Keycloak users have the org-admin-saas role and approved organization attributes
    When a platform administrator opens Users
    Then the directory shows their login identity, organization and actual Stripe subscription status
    And subscription details belong to the organization rather than being resolved solely by email

  @UC-SAAS-002 @implemented
  Scenario: Distinguish no subscription, unresolved membership and unavailable billing
    Given directory entries have different organization/billing outcomes
    When their rows are displayed
    Then a confirmed absence is labelled No subscription
    And unresolved organization mapping and failed billing access are not presented as a paid tier

  @UC-SAAS-003 @implemented
  Scenario: Filter only the current directory page
    Given a page of SaaS users has loaded
    When the administrator searches by name, username, email, organization, plan or status
    Then filtering applies to that page
    And the interface does not imply a whole-directory server search

  @UC-SAAS-004 @implemented
  Scenario: Open a user's billing details
    Given a directory row is available
    When the administrator opens it
    Then login, email, organization, available registration date, plan, subscription state and period end are shown
    And missing dates are not invented

  @UC-SAAS-005 @implemented
  Scenario: Separate application roles from backend directory credentials
    Given the human has greenstand-admin but the backend cannot read Keycloak role membership
    When the directory is requested
    Then an explicit directory service error is shown instead of No users
    And the interface does not grant the human realm-management privileges to work around the backend credential

  @UC-SAAS-006 @implemented
  Scenario: Restrict the platform directory
    Given an organization member or organization administrator is signed in
    When they request the platform SaaS user API directly
    Then the server refuses access
    And a confirmed empty role-membership result is distinct from that refusal or a service error
