const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS;

const checkAuthentication = (req, res, next) => {
    // Exclude login and signup routes from authentication verification
    if (req.path === '/api/user/login' || req.path === '/api/user/signup' || req.path === '/api/user/logout') {
        return next();
    }
    if (req.path === '/api/user/refresh') {
        return next();
    }
    req.user = null;
    const authHeaderValue = req.headers.authorization;
    if (!authHeaderValue || !authHeaderValue.startsWith('Bearer')) {
        return res.status(401).json("You are not authorized");
    }
    const token = authHeaderValue.split(" ")[1];
    try {
        jwt.verify(token, JWT_SECRET_ACCESS, (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } catch (e) {
        res.status(500).send({
            status: "unsuccess",
            message: "Error while authentication",
        });
    }
};

const restrictTo = (roles) => {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json("You are not authorized");
        }
        if (!roles.includes(req.user.role)) {
            return res.status(401).json("unauthorized");
        }
        return next();
    }
}
module.exports = {
    checkAuthentication, restrictTo
}