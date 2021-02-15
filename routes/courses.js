const express = require('express');
const router = express.Router({mergeParams: true});

const { getCourses, getCourse, addCourse, updateCourse, deleteCourse, } = require('../controllers/courses');

// Import protect user functionality
const { protect } = require('../middleware/auth')

// Advanced result for pagination and select and etc
const advancedResult = require('../middleware/advancedResult');

// Course Model
const Course = require('../models/Course')

// Courese route
router.route('/')
    .get(advancedResult(Course,{
        path: 'bootcamp',
        select: 'name description'  
    }),getCourses)
    .post(protect, addCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;