const express = require("express");
const connectDB = require("./configs/db");
const corsMiddleware = require('./middleware/cors');
const helmetMiddleware = require('./middleware/helmet');
const userRoute = require("./routes/userRoute");
const articleRoute = require("./routes/articleRoute");
const commentRoute = require("./routes/commentRoute");
const checkAuthentication = require("./middleware/verifyAuth");
require('dotenv').config()


const PORT = process.env.PORT;
const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware)
app.use(helmetMiddleware)
app.use(checkAuthentication)
app.use("/api/user", userRoute);
app.use("/api/article", articleRoute);
app.use("/api/comment", commentRoute);
app.use("/", (req, res) => {
  res.send(`${req.method} Route ${req.path} not found !`);
});


module.exports = app;