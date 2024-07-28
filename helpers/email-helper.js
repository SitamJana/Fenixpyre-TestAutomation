const easyYopmail = require('easy-yopmail');
const { sleep } = require('./utility-helper');
const { createLogEntry } = require('./log-helper');

/**
 * Gets a new temporary email address from Yopmail.
 *
 * @returns {Promise<string>} A promise that resolves to the new email address.
 */
async function getNewEmailAddress(logger) {

    const getEmailAddress = easyYopmail.getMail().then(email => {
        return email;
    });

    let newEmailId = await getEmailAddress;

    createLogEntry(logger, `Got a new email address - ${newEmailId}`);

    return newEmailId;

}

/**
 * Gets the inbox contents for a given email address.
 *
 * @param {string} emailId The email address to check.
 * @returns {Promise<object>} A promise that resolves to the inbox contents.
 */
async function getEmailInboxContents(logger, emailId) {

    const getEmailInbox = easyYopmail.getInbox(emailId).then(inbox => {
        return inbox;
    });

    let emailInboxContents = await getEmailInbox;

    createLogEntry(logger, `Got ${emailId} Email Inbox Contents - ${JSON.stringify(emailInboxContents.inbox)}`);

    return emailInboxContents;

}

/**
 * Reads an email message from a given inbox.
 *
 * @param {string} emailId The email address to check.
 * @param {string} emailMessageId The ID of the email message.
 * @param {string} readFormat The format to read the email in (default: 'TXT').
 * @returns {Promise<object>} A promise that resolves to the email message content.
 */
async function readEmailMessage(logger, emailId, emailMessageId, readFormat = 'TXT') {

    const getEmailMessage = easyYopmail.readMessage(emailId, emailMessageId, readFormat).then(message => {
        return message;
    });

    let emailMessage = await getEmailMessage;

    createLogEntry(logger, `Got ${emailId} Email message - ${JSON.stringify(emailMessage)}`);

    return emailMessage;

}

/**
 * Waits for an email to arrive in the given inbox.
 *
 * @param {string} emailId The email address to check.
 * @param {number} retryCount The number of times to retry (default: 20).
 */
async function waitForEmailToArrive(logger, emailId, retryCount = 20) {

    createLogEntry(logger, `Waiting for Email to arrive in ${emailId} Email inbox ...`);

    let emailInboxContents;

    while (retryCount-- > 0) {
        emailInboxContents = await getEmailInboxContents(logger, emailId);
        if (emailInboxContents.inbox.length > 0) {
            createLogEntry(logger, `New Email arrived in ${emailId} Email inbox!`);
            break;
        }

        createLogEntry(logger, `Email YET to arrive in ${emailId} Email inbox! Retrying in 2 seconds ...`);
        await sleep(logger, 2000);
    }

}

module.exports = { getNewEmailAddress, getEmailInboxContents, readEmailMessage, waitForEmailToArrive };