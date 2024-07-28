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
  test("Verify Sign In Flow", async ({ page }) => {

    // Create instances of SignInPage and FileListPage
    const signInPage = new SignInPage(page, loggerInstance);
    const fileListPage = new FileListPage(page, loggerInstance);

    // Perform sign-in action
    await signInPage.signInUser();

    // Validate successful sign-in by navigating to the file list page
    await fileListPage.validateSuccessfulSignIn();

  });

});
