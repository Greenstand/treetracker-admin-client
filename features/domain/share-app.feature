@ndm @acceptance_spec @manual
Feature: Share App organization invitations
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-SHARE-001 @implemented
  Scenario: Reuse the existing Share App screen for an approved organization
    Given an organization has a name and its existing numeric mobile mapping
    When its member opens Share App
    Then the invite link and QR code represent that organization
    And the screen reads the organization through the scoped Stakeholder API rather than the legacy organization lookup

  @UC-SHARE-002 @implemented
  Scenario: Select an organization as a platform administrator
    Given a platform administrator has no organization selected
    When they open Share App
    Then organization selection is required before an invite is generated
    And changing to an organization with the same name but a different mapped ID updates both link and QR

  @UC-SHARE-003 @implemented
  Scenario: Copy and download the organization invite
    Given an organization's invite is visible
    When the user chooses Copy
    Then the exact invite URL is copied and success or failure feedback is shown
    When the user chooses Download your QR code
    Then a three-hundred-by-three-hundred PNG for that invite is downloaded

  @UC-SHARE-004 @implemented
  Scenario: Preserve the current mobile link and install-referrer contract
    Given a grower opens an invite containing URL-encoded organization name and numeric ID
    When the existing app redirect page runs on Android
    Then it attempts the current Treetracker app link with that organization
    And it preserves organization values in the Google Play install referrer fallback
    And hiding the page cancels the redundant fallback timer

  @UC-SHARE-005 @implemented
  Scenario: Block missing mappings and warn about local-only links
    Given an organization has no mobile organization mapping or name
    When Share App opens
    Then no UUID is substituted for the app's numeric organization ID
    And the user is told what is missing
    And a localhost-based preview link is identified as unsuitable for growers' phones
