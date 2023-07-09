const express = require("express");
const connectDB = require("./configs/db");
const corsMiddleware = require('./middleware/cors');
const helmetMiddleware = require('./middleware/helmet');
const rateLimitMiddleware = require('./middleware/rateLimit');
const userRoute = require("./routes/userRoute");
const articleRoute = require("./routes/articleRoute");
const commentRoute = require("./routes/commentRoute");
const {checkAuthentication} = require("./middleware/verifyAuth");
const {restrictTo} = require("./middleware/verifyAuth");
const {requestResponseMiddleware}=require("./middleware/logger")
require('dotenv').config()

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestResponseMiddleware)
app.use(corsMiddleware)
app.use(helmetMiddleware)
app.use(rateLimitMiddleware)
app.use(checkAuthentication)
app.use("/api/user", userRoute);
app.use("/api/article", articleRoute);
app.use("/api/comment", commentRoute);
app.use("/", (req, res) => {
  res.send(`${req.method} Route ${req.path} not found !`);
});
module.exports = app;