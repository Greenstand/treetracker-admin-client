Feature: Organization Features
  We allow user to apply for an organization, as an organization, user can approve or reject trees, manage grower under the org.
  Check the `docs/organization-onboarding.md` for more details.
  
  @skip 
  Scenario: Apply for an organization
    Given I am registered user
    And I am on the organization application page
    When I fill in the organization details
    And I submit the form
    Then I should see a confirmation message
    And Go the home page
    And I should see the `verify` menu item on the menu bar on the top left
    When I click `vierfy` 
    Then I see the verify page with no tree on the list
    # for a new organzation without new coming tree, the verify list is empty, the request to admin api should filter by organization, tree not belongs to current organization is not shown here.


  Scenario: Organization shares the Treetracker app deeplink
    As an organization on Greenstand, I can share the Treetracker app with people
    through a deeplink that carries my organization info (name + DB id) into the
    mobile app, plus a QR code planters can scan.
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


