const { body, validationResult } = require('express-validator'); 


// Middleware for validating and sanitizing user input
const registerInputValidation = [
    body('username')
        .isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters long')
        .trim()
        .escape(),

    body('email')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),

    body('mobile')
        .isMobilePhone('en-IN')
        .withMessage('Invalid mobile number')
        .trim()
        .escape(),

    body('address')
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters long')
        .trim()
        .escape(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .trim()
        .escape()
    ,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const loginInputValidation = [
    body('email')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .trim()
        .escape()
    ,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const courseInputValidation = [
    body('title')
        .isLength({ min: 2 })
        .withMessage('Title must be at least 2 characters long')
        .trim()
        .escape(),

    body('content')
        .isLength({ min: 2 })
        .withMessage('Content must be at least 2 characters long')
        .trim()
        .escape(),
    
    body('videos')
        .isLength({ min: 1 })
        .withMessage('videos must be at least 1 character long')
        .trim()
        .escape(),
    
    body('active')
        .isLength({ min: 1 })
        .withMessage('active must be at least 1 character long')
        .trim()
        .escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


module.exports = {
    registerInputValidation,
    loginInputValidation,
    courseInputValidation
}