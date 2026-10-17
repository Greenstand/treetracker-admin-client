Feature: Org Subscription
  An organization pays for premium through Stripe Checkout.

  Scenario: Org Subscription
    Given I am the user with role "organization"
    And I login
    Then I should see the upgrade button on the home page
    When I click the upgrade button
    Then I should see the text "Please pay to subscribe to our organization premium"
    When I pay with the Stripe test card
    Then I should see that the organization is premium
    When I open the home page
    Then I should see the premium line on the home page
