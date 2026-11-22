@ndm @acceptance_spec @manual
Feature: Platform grower organization transfers
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-MOVE-001 @implemented
  Scenario: Transfer a grower with a required reason
    Given a platform administrator opens a grower with a known profile version
    When the administrator selects a different active organization and supplies a reason
    Then the current primary organization and organization links are updated atomically
    And the transfer history records previous and new organization, real actor and reason

  @UC-MOVE-002 @implemented
  Scenario: Close old project memberships without moving historical records
    Given a grower has active projects in their old primary organization
    When the grower is transferred
    Then those active assignments are ended and audited
    And historical sessions, captures, contracts and payments retain their ownership
    And staff Keycloak membership and Stripe metadata are not changed by this action

  @UC-MOVE-003 @implemented
  Scenario: Reject unauthorized or invalid transfers
    Given an organization member is not a platform administrator
    When they request a transfer through a forged direct API call
    Then the transfer is refused
    And inactive targets, missing reasons and the existing primary organization are not accepted as a new transfer

  @UC-MOVE-004 @implemented
  Scenario: Protect against stale versions and duplicate transfer retries
    Given a grower changed after the transfer dialog opened
    When the old profile version is submitted
    Then the transfer is rejected without partial updates
    But retrying an identical successful request returns the original audit outcome once
