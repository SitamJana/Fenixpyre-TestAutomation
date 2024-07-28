const { createLogEntry } = require('./log-helper');

/**
 * Pauses execution for the specified number of milliseconds.
 *
 * Creates a Promise that resolves after the given time, allowing for asynchronous
 * waiting without blocking the event loop.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise} A Promise that resolves after the specified time.
 */
function sleep(logger, ms) {
    createLogEntry(logger, `Sleeping for ${ms / 1000} second(s)`);
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = { sleep };