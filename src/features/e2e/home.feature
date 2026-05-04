@e2e @smoke
Feature: Home Page
  As a visitor
  I want to browse the home page
  So that I can discover products and navigate the site

  Background:
    Given I am on the home page

  @smoke
  Scenario: Home page loads successfully
    Then the page title should contain "Automation Exercise"
    And the navigation bar should be visible
    And featured products should be displayed

  @regression
  Scenario: Search for a product from the home page
    When I search for "Blue Top"
    Then I should see search results for "Blue Top"

  @regression
  Scenario: Navigate to login page
    When I click on the Login/Signup link
    Then I should be on the login page
