const { expect } = require("@playwright/test");
const { sleep } = require('../helpers/utility-helper');
const { getNewEmailAddress, getEmailInboxContents, readEmailMessage, waitForEmailToArrive } = require("../helpers/email-helper");
const { createLogEntry } = require("../helpers/log-helper");

// Define SignInPage class for interacting with Sign In page elements
exports.SignInPage = class SignInPage {
  constructor(page, logger) {
    this.page = page;
    this.logger = logger;

    // Define page locators for various UI elements
    this.emailInputBox = page.locator('input[name=email]');
    this.continueButton = page.locator('#email-btn');
    this.continueToReceiveOtpButton = page.locator('button[id="1-submit"]');
    this.otpInputBox = page.locator('input[id="1-vcode"]');
    this.otpSubmitButton = page.locator('button[id="1-submit"]');
  }

  // Navigate to the sign in page
  async navigate() {
    createLogEntry(this.logger, 'Navigating to the Sign in page');
    await this.page.goto("/fenixpyre/s/669ff2910e5caf9f73cd28ea/QA%2520Assignment");
  }

  // Sign in to the application
  async signInUser() {
    const newEmailId = await getNewEmailAddress(this.logger);

    createLogEntry(this.logger, `Entering ${newEmailId} into the Email Input box`);
    await this.emailInputBox.fill(newEmailId);

    createLogEntry(this.logger, 'Clicking on Continue button');
    await this.continueButton.click();

    createLogEntry(this.logger, 'Clicking on Continue button again to receive OTP');
    await this.continueToReceiveOtpButton.click();

    await waitForEmailToArrive(this.logger, newEmailId);

    createLogEntry(this.logger, 'Reading OTP from the Mailbox ...');
    const emailInboxContents = await getEmailInboxContents(this.logger, newEmailId);
    const emailMessage = await readEmailMessage(this.logger, newEmailId, emailInboxContents.inbox[0].id);
    const splittedMessageArray = emailMessage.submit.split(' ');
    const otpCode = splittedMessageArray[splittedMessageArray.length - 1];
    createLogEntry(this.logger, `Received OTP in the Mailbox. OTP is ${otpCode}`);

    createLogEntry(this.logger, `Entering ${otpCode} as OTP into the OTP Input box`);
    await this.otpInputBox.fill(otpCode);

    createLogEntry(this.logger, 'Clicking on Continue button');
    await this.otpSubmitButton.click();

  }

};
