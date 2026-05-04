@e2e @regression
Feature: User Authentication
  As a registered user
  I want to log in to my account
  So that I can access my profile and orders

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I log in with email "test@example.com" and password "Test@1234"
    Then I should be redirected to the home page
    And I should see a welcome message

  Scenario: Login fails with invalid credentials
    When I log in with email "wrong@example.com" and password "wrongpass"
    Then I should see an error message "Your email or password is incorrect!"

  Scenario Outline: Login validation with multiple invalid inputs
    When I log in with email "<email>" and password "<password>"
    Then I should see an error message "<error>"

    Examples:
      | email              | password    | error                                    |
      | invalid@email.com  | wrongpass   | Your email or password is incorrect!     |
      | notanemail         | somepass    | Your email or password is incorrect!     |
