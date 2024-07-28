const { expect } = require("@playwright/test");
const { sleep } = require('../helpers/utility-helper');
const { CommonPage } = require("./common-page");
const { createLogEntry } = require("../helpers/log-helper");

// Define FileListPage class for interacting with the file list page
exports.FileListPage = class FileListPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.commonPage = new CommonPage(page, logger);

    // Define page locators for various UI elements
    this.userInfo = page.locator('#user-info');
    this.fileActionsMenuIcon = page.locator('#fp-sharedlink-table-body tr:nth-child(1) [data-testid=ellipsis-icon]');
    this.fileOpenInNewTabLink = page.locator('[id*=actions-open]');
    this.filePreviewLink = page.locator('[id*=actions-preview]');
    this.sharedMenu = page.locator('[id="menu-/shared"]');
    this.homeMenu = page.locator('[id="menu-/home"]');
    this.searchBox = page.locator('#fp-home-recentfiles-search-bar');

    this.loaderIconLocator = '#loader';
    this.fileListTableBodyLocator = 'tbody[id*=table-body]';

    this.officeIframeLocator = 'iframe[name="office_frame"]';
    this.officeDocumentEditingModeLocator = '[aria-label*="Editing Selected"]';
    this.officeDocumentPreviewModeLocator = '[aria-label*="Viewing Selected"]';
  }

  // Validate successful sign in by checking user info visibility
  async validateSuccessfulSignIn() {
    createLogEntry(this.logger, 'Validating sign in successful');
    await expect(this.userInfo).toBeVisible();
  }

  // Wait for the file list to appear after loader disappears
  async waitForFileListToAppear() {
    await this.commonPage.waitForLoaderIconToDisappear();

    createLogEntry(this.logger, 'Waiting for file list to appear');
    await this.page.waitForSelector(this.fileListTableBodyLocator, { state: 'visible' });
    await sleep(this.logger, 2000);
  }

  // Navigate to the shared menu
  async goToSharedMenu() {
    await this.waitForFileListToAppear();

    createLogEntry(this.logger, 'Clicking on Shared menu');
    await this.sharedMenu.click();

    await this.waitForFileListToAppear();
  }

  // Open a file in a new tab and validate editing mode
  async clickOpenInNewTabLinkAndValidateFileOpenedInEditMode() {
    const officePagePromise = this.page.waitForEvent('popup');

    createLogEntry(this.logger, 'Clicking on Action tab on a file row');
    await this.fileActionsMenuIcon.click();

    createLogEntry(this.logger, 'Clicking on "Open in new tab" link');
    await this.fileOpenInNewTabLink.click();
    const officePage = await officePagePromise;

    createLogEntry(this.logger, 'Validating file is opened in Edit mode');
    await expect(
      officePage.frameLocator(this.officeIframeLocator).locator(this.officeDocumentEditingModeLocator)
    ).toBeVisible();

    officePage.close();
  }

  // Open a file in preview mode and validate preview mode
  async clickPreviewLinkAndValidateFileOpenedInPreviewMode() {
    const officePagePromise = this.page.waitForEvent('popup');

    createLogEntry(this.logger, 'Clicking on Action tab on a file row');
    await this.fileActionsMenuIcon.click();

    createLogEntry(this.logger, 'Clicking on "Preview" link');
    await this.filePreviewLink.click();
    const officePage = await officePagePromise;

    createLogEntry(this.logger, 'Validating file is opened in Preview mode');
    await expect(
      officePage.frameLocator(this.officeIframeLocator).locator(this.officeDocumentPreviewModeLocator)
    ).toBeVisible();

    officePage.close();
  }

  // Navigate to the home menu
  async goToHomeMenu() {
    await this.waitForFileListToAppear();

    createLogEntry(this.logger, 'Clicking on Home menu');
    await this.homeMenu.click();
    await this.waitForFileListToAppear();
  }

  // Validate home menu navigation
  async validateHomeMenuNavigation() {
    createLogEntry(this.logger, 'Validating Home menu appears');
    await expect(this.page).toHaveURL(/.*home/);
  }

  // Search for file by file name
  async searchforFile(searchText) {
    createLogEntry(this.logger, 'Entering file name in search box');
    await this.searchBox.fill(searchText);
  }

  // Validate search result
  async validateSearchResult(textToValidate) {
    createLogEntry(this.logger, 'Validating file appears whose file name contains the search text');
    await expect(
      this.page.locator(`//*[@id='fp-home-recentfiles-recenttable-body']//td[contains(., '${textToValidate}')]`)
    ).toBeVisible();
  }


};
