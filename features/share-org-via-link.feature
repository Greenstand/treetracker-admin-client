Feature: Share organization via link

  As an organization on Greenstand, I can share the Treetracker app with people
  through a deeplink that carries my organization info (name + DB id) into the
  mobile app, plus a QR code planters can scan.

  Scenario: Organization shares the Treetracker app deeplink
    Given I am logged in as an organization
    When I open the "Share App" menu item
    Then I should see the text "Here is your link to share with your planter"
    And I should see the share link
    And I should see the "copy" button
    When I click the "copy" button
    Then I should see the notification "copied"
    And I should see the text "Here is your QR code to present to your planter"
    And I should see the QR code
    And I should see the "download your QR code" button
    When I click the "download your QR code" button
    Then I should see the notification "Downloading your QR code..."
