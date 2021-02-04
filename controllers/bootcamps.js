const Bootcamp = require('../models/Bootcamp')

// @desc  get all bootcamps
// @route GET api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamp.length, data: bootcamp })        
    } catch (error) {
        res.status(400).json({success: false});
        console.log(error.message)
    }

}
// @desc  get all bootcamps
// @route GET api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return res.status(400).json({success: false})
        }
        res.status(200).json({ success: true, data: bootcamp })    
    } catch (error) {
        res.status(400).json({success: false});
        console.log(error.message)
    }
    
}
// @desc  get all bootcamps
// @route GET api/v1/bootcamps
// @access private
exports.createBootcamps = async(req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({ success: true, data: bootcamp})        
    } catch (err) {
        res.status(400).json({success: false})
        console.log(err.message);
    }

}
// @desc  update  bootcamp
// @route PUT api/v1/bootcamps/:id
// @access private
exports.updateBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if(!bootcamp){
            return res.status(400).json({success: false})    
        }

        res.status(200).json({ success: true, data: bootcamp })    
    } catch (error) {
        res.status(400).json({success: false})
        console.log(error)
    }
}
// @desc  delete  bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access private
exports.deleteBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return res.status(400).json({success: false})    
        }
        
        res.status(200).json({ success: true, data: {} })    
    } catch (error) {
        res.status(400).json({success: false})
        console.log(error)
    }
}
