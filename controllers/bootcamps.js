const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const { populate } = require('../models/Bootcamp');
const advancedResult = require('../middleware/advancedResult');


// @desc  get all bootcamps
// @route GET api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResult);

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

});

// @desc  delete  bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access private
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(new errorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404))    
    }

    await bootcamp.remove();
        
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
});

// @desc  Upload a photo
// @route PUT api/v1/bootcamps/:id
// @access private
exports.uploadPhotoToBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(new errorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404))    
    }

    // Check if there is a photo
    if(!req.files){
        return next(new errorResponse(`Please upload a photo`, 400))    
    }
    const file = req.files.file;
    console.log(file)
    // Make sure the photo is a image
    if(!file.mimetype.startsWith('image')){
        return next(new errorResponse(`Please upload a image not another file`, 400))
    }
    // Checking file size 
    if(file.size > process.env.MAX_FILE_SIZE){
        return next(new errorResponse(`Please upload a picture less than ${process.env.MAX_FILE_SIZE}`, 400))
    }
    // Create custom name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
        if(err){
            console.error(err)
            return next(new errorResponse(`Error in upload process`, 400))
        } 
            await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
            res.status(200).json({ success: true, data: file.name }) 
    })


});