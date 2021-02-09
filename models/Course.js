const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Plesase add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Plesase add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Plesase add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Plesase add a skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        require: true
    }
})


module.exports = mongoose.model('Course', CourseSchema);