const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
// @desc  get all bootcamps
// @route GET api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    
        const bootcamp = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp });

})
// @desc  get single bootcamps
// @route GET api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(new errorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })    
    
})
// @desc  get all bootcamps
// @route GET api/v1/bootcamps
// @access private
exports.createBootcamps = asyncHandler(async(req, res, next) => {
        
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({ success: true, data: bootcamp})        

})
// @desc  update  bootcamp
// @route PUT api/v1/bootcamps/:id
// @access private
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if(!bootcamp){
        return next(new errorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404))    
    }
    res.status(200).json({ success: true, data: bootcamp })

})
// @desc  delete  bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access private
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if(!bootcamp){
        return next(new errorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404))    
    }
        
    res.status(200).json({ success: true, data: {} })    

});
