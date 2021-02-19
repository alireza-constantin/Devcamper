const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc  get all course
// @route GET api/v1/courses
// @route GET api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandler(async (req, res, next)=>{

    if(req.params.bootcampId){
        const courses = await Course.find({
            bootcamp: req.params.bootcampId
        })
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResult)
    }

    
});

// @desc  get single course
// @route GET api/v1/courses
// @access public
exports.getCourse = asyncHandler(async (req, res, next)=>{
    const courses = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    }) 

    if(!courses){
        return (new ErrorResponse(`There isn't any course with this id ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: courses
    })
});

// @desc  add single course
// @route POST api/v1/bootcamps/:bootcampsId/courses
// @access private
exports.addCourse = asyncHandler(async (req, res, next)=>{
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    
    if(!bootcamp){
        return (new ErrorResponse(`There isn't any course with this id ${req.params.id}`), 404)
    }

    // Make sure the user is owner of the bootcamp
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.name} not authorized to add course to this bootcamp`, 401))    
    }
    
    const courses = await Course.create(req.body); 

    res.status(200).json({
        success: true,
        data: courses
    })
});

// @desc  Update single course
// @route PUT api/v1/bootcamps/:courseId
// @access private
exports.updateCourse = asyncHandler(async (req, res, next)=>{
    let course = await Course.findById(req.params.id)
    
    if(!course){
        return (new ErrorResponse(`There isn't any course with this id ${req.params.id}`), 404)
    }
    
    // Make sure the user is owner of the bootcamp
    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.name} not authorized to update course in this bootcamp`, 401))    
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }) 

    res.status(200).json({
        success: true,
        data: course
    })
});

// @desc  delete single course
// @route DELETE api/v1/bootcamps/:courseId
// @access private
exports.deleteCourse = asyncHandler(async (req, res, next)=>{
    const course = await Course.findById(req.params.id)
    
    if(!course){
        return (new ErrorResponse(`There isn't any course with this id ${req.params.id}`), 404)
    }
    
    // Make sure the user is owner of the bootcamp
    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.name} not authorized to delete course in this bootcamp`, 401))    
    }

    await course.remove(); 

    res.status(200).json({
        success: true,
        data: {}
    })
});