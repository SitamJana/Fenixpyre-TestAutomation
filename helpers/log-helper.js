const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

// const dateTimeFormat = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

/**
* Creates a Winston logger instance with two transports:
*   - Console: Logs to the console for immediate output.
*   - File: Logs to a file named 'logs/test-logs.log' for persistent storage.
*/
function createLogFile(fileName) {
    const logger = createLogger({
        format: combine(
            label({ label: '' }),
            timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
            myFormat
        ),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: `logs/${fileName}`, options: { flags: 'w' }
            })
        ]
    });

    return logger;
}

/**
 * Logs a message with the specified log level using the provided logger instance.
 * Default log level is 'info'.

 * @param {winston.logger} loggerInstance The Winston logger instance
 * @param {string} message Log message to entry to the log file
 * @param {string} logLevel Log level for the log entry
 */
function createLogEntry(loggerInstance, message, logLevel = 'info') {
    loggerInstance.log(
        {
            level: logLevel,
            message
        }
    );
}

module.exports = { createLogFile, createLogEntry };