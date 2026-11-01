Feature: Project Species Selection
  Background:
    Given I am logged in as an Org Admin
    And I am on the Species page


  Scenario: Org Admin views the global species list
    Then I should see species "Persea americana" and "Mangifera indica"
    And each species should show its ID, Latin name and common name
    And each species should have its "Use" toggle off by default


  Scenario: Org Admin enables a species for a project
    Given I have selected project "Mango Coast"
    When I turn on "Use" for "Mangifera indica"
    Then I should see "1 selected"
    And the "Save Project Species" button should be enabled


  Scenario: Save is unavailable when no species are selected
    Given I have selected project "Mango Coast"
    And no species are selected
    Then I should see "0 selected"
    And the "Save Project Species" button should be disabled


  Scenario: Org Admin saves the species for a project
    Given I have selected project "Mango Coast"
    And I turn on "Use" for "Mangifera indica"
    When I click "Save Project Species"
    Then "Mangifera indica" should be saved as a species for "Mango Coast"


  Scenario: Org Admin sets a local name for a species in a project
    Given I have selected project "Mango Coast"
    And I turn on "Use" for "Mangifera indica"
    When I enter local name "Embe" for "Mangifera indica"
    And I click "Save Project Species"
    Then "Mangifera indica" should show local name "Embe" for "Mango Coast"


  Scenario: Org Admin clears the current selection
    Given I have selected project "Mango Coast"
    And I turn on "Use" for "Mangifera indica"
    When I click "Clear Selection"
    Then I should see "0 selected"
    And all "Use" toggles should be off


  Scenario: Species selections are kept separate for each project
    Given "Mangifera indica" is saved for project "Mango Coast"
    When I switch to a different project
    Then "Mangifera indica" should not be selected for that project


  Scenario: Org Admin searches the species list
    When I search for "avocado"
    Then I should only see "Persea americana" in the list


  Scenario: Species statistics show how often each species is used in verification
    Given "Mangifera indica" has been selected 3 times during verification
    Then the Species statistics panel should show "Mango" with 3 uses


  Scenario: Verification dropdown only lists the project's selected species
    Given "Mangifera indica" is saved for project "Mango Coast"
    And "Persea americana" is not saved for project "Mango Coast"
    When I verify a capture in project "Mango Coast"
    And I open the species dropdown
    Then I should see "Mangifera indica"
    And I should not see "Persea americana"
