
// @desc  get all bootcamps
// @route GET api/v1/bootcamps
// @access public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg : `show all bootcamps` })
}
// @desc  get all bootcamps
// @route GET api/v1/bootcamps/:id
// @access public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg : `show bootcamp ${req.params.id}` })
}
// @desc  get all bootcamps
// @route GET api/v1/bootcamps
// @access private
exports.createBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg : `create a bootcamp` })
}
// @desc  update  bootcamp
// @route PUT api/v1/bootcamps/:id
// @access private
exports.updateBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg : `update bootcamp ${req.params.id}` })
}
// @desc  delete  bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access private
exports.deleteBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg : `delete ${req.params.id}` })
}
