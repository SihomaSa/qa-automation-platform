@api @smoke
Feature: Products API
  As a developer
  I want to verify the Products API endpoints
  So that I can ensure the backend behaves as expected

  @smoke
  Scenario: Get all products returns 200
    When I request the products list
    Then the response status code should be 200
    And the response should contain a list of products
    And each product should have id, name, price and brand

  @regression
  Scenario: Response time is within acceptable limits
    When I request the products list
    Then the response time should be under 3000 milliseconds

  @regression
  Scenario: Search product returns results
    When I search for product "Blue Top" via API
    Then the response status code should be 200
    And the response should contain products matching "Blue Top"

  @regression
  Scenario: Unsupported HTTP method returns 405
    When I send a DELETE request to the products list endpoint
    Then the response status code should be 405
