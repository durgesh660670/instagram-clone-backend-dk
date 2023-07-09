const winston = require('winston');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');




// Create the logs directory if it doesn't exist
//const logsDir = path.join(__dirname, 'logs');
const logsDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create the logger instance
const logger = winston.createLogger({
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDir, 'app.log') })
  ]
});



// Custom formatter example
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const indiaTime = moment.tz(timestamp, "Asia/Kolkata").format(); // get Indian time
  return `${indiaTime} [${level.toUpperCase()}]: ${message}`; // include Indian time in log message
});


const customLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDir, `custom-${moment.tz("Asia/Kolkata").format("YYYY-MM-DD")}.log`) }) // add Indian time to log file name
  ]
});

const requestClientIp = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDir, `requestClientIp-${moment.tz("Asia/Kolkata").format("YYYY-MM-DD")}.log`) }) // add Indian time to log file name
  ]
});

const requestResponse = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsDir, `requestResponse-${moment.tz("Asia/Kolkata").format("YYYY-MM-DD")}.log`) }) // add Indian time to log file name
  ]
});

function requestResponseMiddleware(req, res, next) {
  requestResponse.info("Request - " + `${req.method} ${req.url}`);

  // Capture request payload
  if (req.body) {
    requestResponse.info("Request Payload - " + JSON.stringify(req.body));
  }

  res.on('finish', () => {
    requestResponse.info("Response - " + `${res.statusCode} ${res.statusMessage}`);

    // Capture response payload
    const originalSend = res.send;
    res.send = function (body) {
      requestResponse.info("Response Payload - " + JSON.stringify(body));
      originalSend.call(this, body);
    };
  });

  next();
}





module.exports = {
  // logger,
  customLogger,
  requestResponseMiddleware,
  requestClientIp
  // requestResponse
}
