@ndm @acceptance_spec @manual
Feature: Subscription plans and quota usage
  Acceptance criteria for the domain administration integration.
  Roles and fixtures are defined in README.md.

  @UC-QUOTA-001 @implemented
  Scenario: Read prices from Stripe and identify allowance proposals
    Given configured Seed, Root, Base and Crown Stripe products exist
    When the plans page loads
    Then amounts, currency and billing interval come from Stripe
    And the existing confirmed and proposed allowance labels are preserved
    And a failed price lookup is not replaced by an invented amount

  @UC-QUOTA-002 @implemented
  Scenario: Display used and allowed resources for the current organization tier
    Given the current Stripe tier is Seed with allowances of one project, five thousand captures and ten growers
    And the organization manages one project, twelve hundred captures and two growers
    When Subscription plans is opened
    Then Projects, Captures and Growers show their actual used and allowed counts
    And one project out of one is labelled At quota rather than Over quota

  @UC-QUOTA-003 @implemented
  Scenario: Warn in red and recommend a tier that fits every resource
    Given Seed usage is six projects, six thousand captures and eleven growers
    And configured Root allows five projects while Base allows twenty
    When quota usage is displayed
    Then Projects, Captures and Growers are explicitly marked Over quota in red
    And the account warning identifies each exceeded resource
    And the upgrade action recommends Base rather than an insufficient Root tier

  @UC-QUOTA-004 @implemented
  Scenario: Count total managed records without duplicates
    Given raw pending and rejected captures and approved raw/processed copies exist
    And growers have several organization/project/session links
    When usage is calculated
    Then captures are counted once by UUID including pending and rejected records
    And growers match the Growers list and are counted once
    And archived projects are included
    And the capture allowance is not reset as a monthly upload counter

  @UC-QUOTA-005 @implemented
  Scenario: Handle the highest tier and missing quota information
    Given no higher configured tier can fit all current usage
    When the account is over quota
    Then the warning directs the organization to Greenstand for additional capacity
    And an insufficient upgrade is not recommended
    And missing tier or failed usage data never produces fake zeros or a false over-quota warning

  @UC-QUOTA-006 @implemented
  Scenario: Open upgrade confirmation only through authorized billing
    Given an authorized organization administrator sees a recommended upgrade
    When they choose the upgrade action
    Then the existing hosted Stripe confirmation flow opens for the recommended tier
    And the page does not silently charge or change the subscription
    And members without billing permission are directed to their administrator

  @UC-QUOTA-007 @pending
  Scenario: Enforce agreed quotas on resource creation and downgrades
    Given plan allowances and enforcement policy have been approved
    When a resource creation or plan downgrade would exceed an enforced quota
    Then the owning API applies the agreed server-side decision consistently
    And the interface displays the decision and upgrade path
