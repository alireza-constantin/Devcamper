const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const { populate } = require('../models/Bootcamp');


// @desc  get all bootcamps
// @route GET api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    //Copy req.query 
    const reqQuery = {...req.query}
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'limit', 'page']

    // Loop over removeField and delete them from req.query
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let querystr = JSON.stringify(reqQuery)

    // Create operator ($gt, $lt, etc)
    querystr = querystr.replace(/\b(lt|lte|gte|gt|in)\b/g, match => `$${match}`);

    // Finding resource  
    query = Bootcamp.find(JSON.parse(querystr)).populate('courses');     
    // Select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }

    // Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('averageCost')
    }
    // Pagination 
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const bootcamp = await query
    // Pagination result
    const pagination = {}
    if( endIndex < total ){
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if( startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({ success: true, count: bootcamp.length, pagination, data: bootcamp });

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