const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/errorHandler')
const connectDB = require('./config/db')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');

// Load env vars
dotenv.config({path: './config/config.env'})

// connect to database
connectDB();

// Route file
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/user')
const reviews = require('./routes/reviews')
const app = express();

// body parser 
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// File Uploading
app.use(fileUpload());

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);

// Custom Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}...`.yellow.bold));

// handle unhandled error 
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error message : ${err.message}`.red)
    server.close(()=> process.exit(1));
})