@ndm @acceptance_spec @manual
Feature: NDM migrations, references and audit integrity
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-NDM-001 @implemented
  Scenario: Extend only the owning new-domain schemas
    Given a feature needs persistent project, species, session or grower changes
    When its migration and API are reviewed
    Then the owning Stakeholder, Herbarium, Field Data or Treetracker schema is used
    And new fields are not added to public.entity or public.trees
    And cross-service identity references are documented in the relevant draft PR and ERD

  @UC-NDM-002 @implemented
  Scenario: Rehearse and record a dev migration
    Given a verified non-production database and a migration-owner role
    When an approved migration is applied in dev
    Then rollback is rehearsed with disposable data or a savepoint
    And the owning service migration history records the migration
    And production is not changed by that dev operation

  @UC-NDM-003 @implemented
  Scenario: Preserve references when maintaining the production-derived catalogue
    Given the dev catalogue originated from a reviewed production export
    When catalogue maintenance is performed
    Then production is not modified
    And source provenance and backup are retained for the one-off import
    And subsequent field normalization preserves species UUID references

  @UC-NDM-004 @implemented
  Scenario: Preserve exact versions and real actors
    Given a versioned write has a valid authenticated caller
    When a review, allocation, membership or organization-transfer change succeeds
    Then exact database versions are used for conflict detection where supported
    And the logged actor comes from the authenticated request rather than a supplied display name
    And a conflicting transaction does not leave partial successful history
