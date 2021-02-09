const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');

// load env vars
dotenv.config({path: './config/config.env'})

// load models
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

// connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// read JSON file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));

// import data into db
const importData = async() => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log(`Data is imported...`.green.inverse);
        process.exit()
    } catch (error) {
        console.error(error);
    }
}

// delete data from db
const deleteData = async() => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log(`Data is deleted...`.red.inverse);
        process.exit()
    } catch (error) {
        console.error(error);
    }
};

if(process.argv[2] === '-i'){
    importData()
} else if (process.argv[2] === '-d'){
    deleteData()
};

