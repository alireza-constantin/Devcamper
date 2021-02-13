const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, createBootcamps, 
        updateBootcamps, deleteBootcamps, getBootcampsInRadius, uploadPhotoToBootcamps } = require('../controllers/bootcamps')

const advancedResult = require('../middleware/advancedResult');
const Bootcamp = require('../models/Bootcamp');
//Include course router
const courseRouter = require('./courses')

// Re-route bootcamps to courses
router.use('/:bootcampId/courses', courseRouter);

//bootcamps route 
router.route('/').get(advancedResult(Bootcamp, 'courses') ,getBootcamps).post(createBootcamps);
router.route('/:id').get(getBootcamp).put(updateBootcamps).delete(deleteBootcamps);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id/photo').put(uploadPhotoToBootcamps);

module.exports = router;