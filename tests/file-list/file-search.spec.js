const { test, expect } = require("@playwright/test");
const { SignInPage } = require("../../page-objects/sign-in-page");
const { FileListPage } = require("../../page-objects/file-list-page");
const { createLogFile } = require("../../helpers/log-helper");

// Test suite for file search functionality
test.describe("Search for File from File List", () => {

  let loggerInstance;
  const logFileName = 'file-search-tests-logging.log';

  test.beforeAll(async () => {
    loggerInstance = createLogFile(logFileName);
  });

  // Sign in user before each test
  test.beforeEach(async ({ page }) => {
    const signInPage = new SignInPage(page, loggerInstance);
    await signInPage.navigate();
    await signInPage.signInUser();
  });

  // Test case to validate file search workflow
  test("Validate File Search Workflow", {
    tag: '@fileSearch',
  }, async ({ page }) => {
    const fileListPage = new FileListPage(page, loggerInstance);

    // Navigate to the home menu and verify successful navigation
    await fileListPage.goToHomeMenu();
    await fileListPage.validateHomeMenuNavigation();

    // Search for a valid file
    // Please NOTE: This test case fails always as Home file list never loads in playwright browser 
    const validFileName = 'Book';
    await fileListPage.searchforFile(validFileName);
    await fileListPage.validateSearchResult(validFileName);

    // Search for an invalid file
    const invalidFileName = 'File Not Exists';
    await fileListPage.searchforFile(invalidFileName);
    await fileListPage.validateSearchResult('No results');
  });

});
