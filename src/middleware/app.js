const express = require('express')  // npm install express
const app = express()
const coursesRouter = require('./routes/courses')
const userRouter = require('./routes/user')
const mongoose = require('mongoose') // npm install mongoose
const bodyParser = require('body-parser')   //  npm install body-parser
const { logger2 } = require('./middleware/logger')
require('dotenv').config() //installed using  npm install dotenv
const corsMiddleware = require('./middleware/cors');   
const helmetMiddleware = require('./middleware/helmet'); 
const cookieParser = require('cookie-parser'); //npm i cookie-parser
const session = require('express-session');  //npm i express-session
const rateLimitMiddleware=require('./middleware/rateLimit')
const PORT = process.env.PORT;
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;



//middleware  start
app.use(helmetMiddleware)
app.use(cookieParser());
app.use(corsMiddleware)
app.use(bodyParser.json());
app.use(rateLimitMiddleware);
app.use(logger2)
app.use('/REST/courses', coursesRouter.router)
app.use('/REST/user', userRouter.router)


//middleware  end

// mongodb connection start

mongoose.connect(DB_CONNECTION_URL)
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection closed');
    process.exit(0);
  });
});

// mongodb connection end


// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

// end server