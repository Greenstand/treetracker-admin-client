Feature: Species Dropdown in Verification

  Background:
    Given project "Mango Coast" has species "Mangifera indica" saved
    And "Persea americana" exists in the global pool but is not saved for "Mango Coast"
    And I am verifying a capture in project "Mango Coast"

@skip
  Scenario: Dropdown only shows species activated for the project
    When I open the species dropdown
    Then I should see "Mangifera indica"
    And I should not see "Persea americana"

@skip
  Scenario: Dropdown does not show the full global list
    When I open the species dropdown
    Then I should only see the species saved for "Mango Coast"

@skip
  Scenario: Project with no saved species does not fall back to the global list
    Given project "Mango Coast" has no species saved
    When I open the species dropdown
    Then I should not see any species from the global pool

@skip
  Scenario: Newly activated species appears in the dropdown
    Given an Org Admin saves "Persea americana" for project "Mango Coast"
    When I open the species dropdown
    Then I should see "Persea americana"

@skip
  Scenario: Deactivated species no longer appears in the dropdown
    Given an Org Admin removes "Mangifera indica" from project "Mango Coast"
    When I open the species dropdown
    Then I should not see "Mangifera indica"

  @optional
  Scenario: Verifier searches the dropdown
    Given project "Mango Coast" has "Mangifera indica" and "Persea americana" saved
    When I type "mang" in the species dropdown
    Then I should only see "Mangifera indica"

  @optional
  Scenario: Dropdown is sorted by how often species are used
    Given "Persea americana" has been selected more often than "Mangifera indica"
    When I open the species dropdown
    Then "Persea americana" should appear before "Mangifera indica"
