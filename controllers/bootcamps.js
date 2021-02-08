const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
// @desc  get all bootcamps
// @route GET api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let querystr = JSON.stringify(req.query) 
    // modify for less than and greater than
    querystr = querystr.replace(/\b(lt|lte|gte|gt|in)\b/g, match => `$${match}`);
    let query = Bootcamp.find(JSON.parse(querystr));
      
    const bootcamp = await query;
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

// @desc get bootcamps within radius 
// @route GET api/v1/bootcamps/radius/:zipcode/:distance
// @access public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    
    // calc radius using radians
    // divide dist to radius of earth
    // radius of earth 3.963 mile / 6.378 km
    const radius = distance / 3963;
    let bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } } 
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})