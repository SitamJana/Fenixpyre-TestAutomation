const { test, expect } = require("@playwright/test");
const { SignInPage } = require("../../page-objects/sign-in-page");
const { FileListPage } = require("../../page-objects/file-list-page");
const { createLogFile } = require("../../helpers/log-helper");

// Test suite for File Actions workflow
test.describe("File Actions Workflow", () => {

  let loggerInstance;
  const logFileName = 'file-actions-tests-logging.log';

  test.beforeAll(async () => {
    loggerInstance = createLogFile(logFileName);
  });

  // Sign in user before each test
  test.beforeEach(async ({ page }) => {
    const signInPage = new SignInPage(page, loggerInstance);
    await signInPage.navigate();
    await signInPage.signInUser();
  });

  // Test case to verify opening a file in a new tab in Edit mode
  test("Validate clicking on 'Open in new tab' opens the file in a new tab in Edit mode", async ({ page }) => {
    const fileListPage = new FileListPage(page, loggerInstance);
    await fileListPage.clickOpenInNewTabLinkAndValidateFileOpenedInEditMode();
  });

  // Test case to verify opening a file in a new tab in Preview mode
  test("Validate clicking on 'Preview' opens the file in a new tab in Preview mode", async ({ page }) => {
    const fileListPage = new FileListPage(page, loggerInstance);
    await fileListPage.clickPreviewLinkAndValidateFileOpenedInPreviewMode();
  });

});
