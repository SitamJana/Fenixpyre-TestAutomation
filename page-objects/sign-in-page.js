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
    this.emailConfirmInputBox = page.locator('input[id="1-email"]');
    this.errorMessageOnConfirmEmailPopup = page.locator('.auth0-lock-error-invalid-hint');
    this.topErrorMessageOnConfirmEmailPopup = page.locator('.auth0-global-message-error');
    this.continueToReceiveOtpButton = page.locator('button[id="1-submit"]');
    this.otpInputBox = page.locator('input[id="1-vcode"]');
    this.otpSubmitButton = page.locator('button[id="1-submit"]');
  }

  // Navigate to the sign in page
  async navigate() {
    createLogEntry(this.logger, 'Navigating to the Sign in page');
    await this.page.goto("/fenixpyre/s/669ff2910e5caf9f73cd28ea/QA%2520Assignment");
  }

  // Fill email id
  async fillEmailId(emailId) {
    createLogEntry(this.logger, `Entering ${emailId} into the Email Input box`);
    await this.emailInputBox.fill(emailId);
  }

  // Click on continue button
  async clickOnContinueButton() {
    createLogEntry(this.logger, 'Clicking on Continue button');
    await this.continueButton.click();
  }

  // Fill email id on Confirm email popup
  async fillEmailIdOnConfirmEmailPopup(emailId) {
    createLogEntry(this.logger, `Entering ${emailId} into the Email Input box on Confirm Email pop up`);
    await this.emailConfirmInputBox.fill(emailId);
  }

  // Click on continue button to receive otp
  async clickOnContinueToReceiveOtpButton() {
    createLogEntry(this.logger, 'Clicking on Continue button again to receive OTP');
    await this.continueToReceiveOtpButton.click();
  }

  // Sign in to the application
  async signInUser() {
    const newEmailId = await getNewEmailAddress(this.logger);

    await this.fillEmailId(newEmailId);
    await this.clickOnContinueButton();
    await this.clickOnContinueToReceiveOtpButton();

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

  // Validate continue button disabled on invalid email entered
  async validateContinueButtonDisabled() {
    createLogEntry(this.logger, 'Validating Continue button is disabled');
    await expect(this.continueButton).toHaveClass(/cursor-not-allowed/);

    createLogEntry(this.logger, 'Validating Continue button text is "Continue" instead of "Continue with Email"');
    await expect(this.continueButton).toHaveText('Continue');

    createLogEntry(this.logger, 'Validating Continue button tooltip shows the error message');
    await expect(this.continueButton).toHaveAttribute('tooltip', 'Provide a valid email');
  }

  // Validate error message regarding invalid email entered on Confirm email popup
  async validateErrorMessageOnConfirmEmailPopup(expectedErrorMessage) {
    createLogEntry(this.logger, 'Validating Error message regarding invalid email entered on Confirm email popup');
    await expect(this.errorMessageOnConfirmEmailPopup).toHaveText(expectedErrorMessage);
  }

  // Validate top error message regarding invalid email entered on Confirm email popup
  async validateTopErrorMessageOnConfirmEmailPopup(expectedErrorMessage) {
    createLogEntry(this.logger, 'Validating Top Error message regarding invalid email entered on Confirm email popup');
    await expect(this.topErrorMessageOnConfirmEmailPopup).toHaveText(expectedErrorMessage);
  }

};
