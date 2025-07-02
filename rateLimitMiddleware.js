// rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');

// Function to create rate limiters
function createRateLimiter() {
    return rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
        message: {
            message: 'You\'re doing this too much, please try again after a few minutes',
            statusCode: 429,
        },
        handler: (req, res, /*next*/) => {
            res.status(429).json({
                success: false,
                message: "Too many requests. Try again later."
            });
        }
    });
}

module.exports = { createRateLimiter };
