Feature: Home Page
  The home page shows four count cards. A Greenstand admin sees the whole
  platform; an organization user sees only their own organization.

  Scenario: Greenstand admin can see all cards
    Given I am a greenstand admin user
    And I am on the home page
    Then I can see the "Total Captures" card showing a count
    And I can see the "Untagged Captures" card showing a count
    And I can see the "Verified Captures" card showing a count
    And I can see the "Growers" card showing a count
    And I record those counts as the platform wide counts

  Scenario: Organization user can see all cards
    Given I am an organization user
    And I am on the home page
    Then I can see the "Total Captures" card showing a count
    And I can see the "Untagged Captures" card showing a count
    And I can see the "Verified Captures" card showing a count
    And I can see the "Growers" card showing a count
    And every count is within the platform wide counts
    And the Total Captures count is below the platform wide count
