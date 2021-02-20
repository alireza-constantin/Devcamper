const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');


// @desc  get all reviews
// @route GET api/v1/reviews
// @route GET api/v1/bootcamps/:bootcampId/reviews
// @access public
exports.getReviews = asyncHandler(async (req, res, next)=>{
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    

    if(req.params.bootcampId){
        
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp with id of ${req.params.bootcampId} is not found`, 404))
        }

        const reviews = await Review.find({
            bootcamp: req.params.bootcampId
        })
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResult)
    }    
});

// @desc  get single review
// @route GET api/v1/reviews/:id
// @access public
exports.getReview = asyncHandler(async (req, res, next)=>{
    
    const review = await  Review.findById(req.params.id).populate({
        path:'bootcamps',
        select:'name description'
    })
    if(!review){
        return next(new ErrorResponse(`Review with id of ${req.params.id} not found`, 404))
    }

    res.status(200).json({
        success: true,
        data: review
    })
});


// @desc  Create  review
// @route POST api/v1/bootcamp/:bootcampId/reviews
// @access public
exports.addReview = asyncHandler(async (req, res, next)=>{
    
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp with id of ${req.params.bootcampId} is not found`, 404))
    }

    const review = await Review.create(req.body)

    res.status(200).json({
        success: true,
        data: review
    })
});

// @desc  Update review
// @route PUT api/v1/reviews/:id
// @access private
exports.updateReview = asyncHandler(async (req, res, next)=>{
    
    let review = await Review.findById(req.params.id)

    if(!review){
        return next(new ErrorResponse(`Review with id of ${req.params.bootcampId} is not found`, 404))
    }
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not authorized to update`, 401))
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: review
    })
});

// @desc  delete review
// @route DELETE api/v1/reviews/:id
// @access private
exports.deleteReview = asyncHandler(async (req, res, next)=>{
    
    const review = await Review.findById(req.params.id)

    if(!review){
        return next(new ErrorResponse(`Review with id of ${req.params.bootcampId} is not found`, 404))
    }
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not authorized to delete`, 401))
    }

    await review.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});