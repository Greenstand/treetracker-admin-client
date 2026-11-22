@ndm @acceptance_spec @manual
Feature: Stripe webhook reconciliation and identity linking
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-HOOK-001 @implemented
  Scenario: Verify signature and Stripe environment before processing
    Given a webhook is configured for one Stripe environment
    When an event has an invalid or expired signature or mismatched livemode
    Then the event is rejected before identity or entitlement changes
    And logs do not include secrets or full personal payloads

  @UC-HOOK-002 @implemented
  Scenario: Reconcile current subscription state instead of trusting a delayed event
    Given a valid supported subscription event arrives
    When the PHP webhook processes it
    Then current Stripe state is retrieved
    And the highest recognized active, trialing or past-due tier is reconciled according to the configured policy
    And an old delayed event does not restore an obsolete plan

  @UC-HOOK-003 @implemented
  Scenario: Resolve organization and user without hardcoded account mappings
    Given a verified customer/user link or exact unique Keycloak email match is available
    And Keycloak contains one approved organization ID
    When a subscription is reconciled
    Then compatible organization and Keycloak user metadata is recorded in Stripe
    And conflicting or ambiguous identity mappings stop reconciliation
    And email alone is not treated as authoritative organization ownership

  @UC-HOOK-004 @implemented
  Scenario: Remove ended plan roles while retaining identity login
    Given no qualifying subscription remains for the linked customer
    When a supported cancellation event is reconciled
    Then obsolete subscriber roles are removed without deleting the Keycloak user
    And app administrative role membership is not fabricated as a billing outcome

  @UC-HOOK-005 @implemented
  Scenario: Handle retries, ignored events and concurrent delivery
    Given an unsupported invoice event or a temporarily failing supported event arrives
    When the webhook handles the delivery
    Then unsupported events are acknowledged and logged as ignored
    And incomplete processing receives a retryable response
    And concurrent processing is serialized instead of interleaving conflicting role changes

  @UC-HOOK-006 @pending
  Scenario: Restrict organization administration after subscription entitlement ends
    Given cancellation has removed subscription tier roles but the user's identity remains valid
    When the user opens subscription-gated organization administration
    Then the agreed entitlement policy restricts paid capabilities while preserving login and upgrade access
    And role membership alone is not mistaken for an active paid entitlement
