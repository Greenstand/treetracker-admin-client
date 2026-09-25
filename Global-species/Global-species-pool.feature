Feature: Global Species Pool 

@skip
Scenario: Super Admin adds a new species to the global pool
    Given I am logged in as a Super Admin
    And I am on the Species Management page
    When I click "Add Species"
    And I enter Latin name "Mangifera indica" and common name "Mango"
    And I enter a reference link "https://example.com/mangifera-indica"
    And I click "Save"
    Then I should see "Mangifera indica" listed with status "Visible" 
