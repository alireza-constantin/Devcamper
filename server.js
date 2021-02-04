const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db')

// Load env vars
dotenv.config({path: './config/config.env'})

// connect to database
connectDB();

// Route file
const bootcamps = require('./routes/bootcamps');
const app = express();

// body parser 
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}...`.yellow.bold));

// handle unhandled error 
process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error message : ${err.message}`.red)
    server.close(()=> process.exit(1));
})