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

  @UC-MOVE-005 @implemented
  Scenario: Explicitly allocate ownerless observations with a grower
    Given a Greenstand administrator selects a destination organization and optional active project
    And a preview identifies the grower's ownerless and projectless sessions and captures
    When the administrator confirms allocation and supplies a reason
    Then the eligible sessions and processed capture ownership are updated in the membership transaction
    And the transfer audit records their exact IDs and previous ownership
    And captures already owned by another organization or linked to tree or token assets are not claimed

  @UC-MOVE-006 @implemented
  Scenario: Refuse a stale allocation preview
    Given eligible observations changed after the allocation preview
    When the administrator confirms the old preview
    Then membership and observation allocation both roll back
    And a refreshed preview is required

  @UC-MOVE-007 @implemented
  Scenario: Keep first allocation restricted to Greenstand admins
    Given an organization administrator finds an unassigned grower
    When they request an allocation preview or submit an allocation directly
    Then the API refuses access
    And no ownership is changed

  @UC-MOVE-008 @implemented
  Scenario: Explicitly reassign existing observations as a Greenstand administrator
    Given a grower has observations allocated to an organization or project
    When a Greenstand administrator explicitly includes existing allocations in the preview and confirms a destination with a reason
    Then eligible observations are reassigned atomically and previous ownership is recorded
    And changing the destination or inclusion mode clears the confirmation
    And organization administrators cannot perform this correction
