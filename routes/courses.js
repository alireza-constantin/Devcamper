
const express = require('express');
const router = express.Router({mergeParams: true});

const { getCourses, getCourse, addCourse, updateCourse, deleteCourse, } = require('../controllers/courses');


const advancedResult = require('../middleware/advancedResult');
const Course = require('../models/Course')

router.route('/').get(advancedResult(Course,{
    path: 'bootcamp',
    select: 'name description'
}),getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;