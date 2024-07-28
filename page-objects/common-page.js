const { expect } = require("@playwright/test");
const { createLogEntry } = require("../helpers/log-helper");

exports.CommonPage = class CommonPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.loaderIconLocator = '#loader';
  }

  /**
   * Waits for the loader icon identified by `#loader` to disappear from the page.
   * This ensures the page has finished loading before proceeding with further tests.
   */
  async waitForLoaderIconToDisappear() {
    createLogEntry(this.logger, 'Waiting for Loader Icon to disappear');
    await this.page.waitForSelector(this.loaderIconLocator, { state: 'hidden' });
  }

};
