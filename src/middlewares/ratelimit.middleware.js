const rateLimit = require('express-rate-limit');
const serviceRateLimitHandler = (req, res, next, options) => {
    res.status(options.statusCode).json({
        error: true,
        message: "Too many request from this ip in 15 minutes, try again later."
    });
};

const authRateLimitHandler = (req, res, next, options) => {
    res.status(options.statusCode).json({
        error: true,
        message: "Too many attempt to login, try again later."
    });
};

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    handler: serviceRateLimitHandler
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 40, 
    handler: authRateLimitHandler
});

module.exports = { apiLimiter, authLimiter }