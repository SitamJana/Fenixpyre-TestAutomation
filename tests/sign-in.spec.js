const { test, expect } = require("@playwright/test");
const { SignInPage } = require("../page-objects/sign-in-page");
const { FileListPage } = require("../page-objects/file-list-page");
const { createLogFile } = require("../helpers/log-helper");

// Test suite for Sign In Page functionality
test.describe("Sign In Page Tests", () => {

  let loggerInstance;
  const logFileName = 'sign-in-page-tests-logging.log';

  test.beforeAll(async () => {
    loggerInstance = createLogFile(logFileName);
  });

  // Set up a new browser context for each test case
  test.beforeEach(async ({ page }) => {

    // Create a new instance of SignInPage and navigate to the Sign In page
    const signInPage = new SignInPage(page, loggerInstance);
    await signInPage.navigate();

  });

  // Test case to verify the sign in flow
  test("Verify Sign In Flow", {
    tag: ['@signin', '@positive'],
  }, async ({ page }) => {

    // Create instances of SignInPage and FileListPage
    const signInPage = new SignInPage(page, loggerInstance);
    const fileListPage = new FileListPage(page, loggerInstance);

    // Perform sign-in action
    await signInPage.signInUser();

    // Validate successful sign-in by navigating to the file list page
    await fileListPage.validateSuccessfulSignIn();

  });

  test("Verify Email ID validation error messages - Initial screen", {
    tag: ['@signin', '@negative'],
  }, async ({ page }) => {

    // Create instances of SignInPage and FileListPage
    const signInPage = new SignInPage(page, loggerInstance);

    // Verify Email ID validation (Blank Email)
    await signInPage.fillEmailId('');
    await signInPage.validateContinueButtonDisabled();

    // Verify Email ID validation (Email missing @ symbol)
    await signInPage.fillEmailId('userdomain.com');
    await signInPage.validateContinueButtonDisabled();

    // Verify Email ID validation (Email missing domain)
    await signInPage.fillEmailId('user@');
    await signInPage.validateContinueButtonDisabled();

    // Verify Email ID validation (Invalid characters)
    await signInPage.fillEmailId('user$%domain.com');
    await signInPage.validateContinueButtonDisabled();

    // Verify Email ID validation (Multiple @ Symbols)
    await signInPage.fillEmailId('user@@domain.com');
    await signInPage.validateContinueButtonDisabled();

  });

  test("Verify Email ID validation error messages - Confirm Email Popup", {
    tag: ['@signin', '@negative'],
  }, async ({ page }) => {

    // Create instances of SignInPage and FileListPage
    const signInPage = new SignInPage(page, loggerInstance);

    // Go to Confirm email popup
    await signInPage.fillEmailId('user@domain.com');
    await signInPage.clickOnContinueButton();

    // Verify Email ID validation (Blank Email)
    await signInPage.fillEmailIdOnConfirmEmailPopup('');
    await signInPage.clickOnContinueToReceiveOtpButton();
    await signInPage.validateErrorMessageOnConfirmEmailPopup("Email can't be blank");

    // Verify Email ID validation (Email missing @ symbol)
    await signInPage.fillEmailIdOnConfirmEmailPopup('userdomain.com');
    await signInPage.clickOnContinueToReceiveOtpButton();
    await signInPage.validateErrorMessageOnConfirmEmailPopup("Email is invalid");

    // Verify Email ID validation (Email missing domain)
    await signInPage.fillEmailIdOnConfirmEmailPopup('user@');
    await signInPage.clickOnContinueToReceiveOtpButton();
    await signInPage.validateErrorMessageOnConfirmEmailPopup("Email is invalid");

    // Verify Email ID validation (Invalid characters)
    await signInPage.fillEmailIdOnConfirmEmailPopup('user$%domain.com');
    await signInPage.clickOnContinueToReceiveOtpButton();
    await signInPage.validateErrorMessageOnConfirmEmailPopup("Email is invalid");

    // Verify Email ID validation (Multiple @ Symbols)
    await signInPage.fillEmailIdOnConfirmEmailPopup('user@@domain.com');
    await signInPage.clickOnContinueToReceiveOtpButton();
    await signInPage.validateTopErrorMessageOnConfirmEmailPopup("The email is invalid");

  });

});
