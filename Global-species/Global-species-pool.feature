Feature: Global Species Pool 


Scenario: Super Admin adds a new species to the global pool
    Given I am logged in as a Super Admin
    And I am on the Species Management page
    When I click "Add Species"
    And I enter Latin name "Acacia tortilis" and common name "Umbrella thorn"
    And I enter a reference link "https://example.com/acacia-tortilis"
    And I click "Save"
    Then I should see "Acacia tortilis" listed with status "Visible"
    

 Scenario: Super Admin edits an existing species
    Given the global pool contains species "Mangifera indica"
    When I click the edit icon for "Mangifera indica"
    And I change the common name to "Mango tree"
    And I click "Save"
    Then the species list should show common name "Mango tree" for "Mangifera indica"
    
@skip
Scenario: Super Admin hides a species instead of deleting it
    Given the global pool contains species "Persea americana" with status "Visible"
    When I click the hide icon for "Persea americana"
    Then "Persea americana" should have status "Hidden"
    And "Persea americana" should not appear in the species list by default
    
@skip
 Scenario: Super Admin reveals hidden species
    Given "Persea americana" has status "Hidden"
    When I toggle "Show hidden" on
    Then I should see "Persea americana" listed with status "Hidden"

@skip
Scenario: Hiding a species globally keeps historical records intact
  Given a capture was verified as "Persea americana"
  When a Super Admin hides "Persea americana" in the global pool
  Then the capture should still show "Persea americana" as its species
    
@skip
  Scenario: Super Admin searches the species list
    Given the global pool contains species "Mangifera indica" and "Persea americana"
    When I search for "mango"
    Then I should only see "Mangifera indica" in the results

@skip
Scenario: Non-Super-Admin cannot access Species Management
    Given I am logged in as a regular Org Admin
    Then I should not see "Species management" in the navigation

@skip
Scenario: Org Admin cannot change the global species list
  Given I am logged in as an Org Admin
  Then I should not be able to add, edit or hide species in the global pool
