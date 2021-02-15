const express = require('express');
const router = express.Router();
const { getBootcamps, getBootcamp, createBootcamps, 
        updateBootcamps, deleteBootcamps, getBootcampsInRadius, uploadPhotoToBootcamps } = require('../controllers/bootcamps')

// Import user protcet functionality from middleware
const { protect, authorize } = require('../middleware/auth');

// Advanced result for pagination and select and etc
const advancedResult = require('../middleware/advancedResult');

// Bootcamp Model
const Bootcamp = require('../models/Bootcamp');

//Include course router
const courseRouter = require('./courses')

// Re-route bootcamps to courses
router.use('/:bootcampId/courses', courseRouter);

//bootcamps route 
router.route('/').get(advancedResult(Bootcamp, 'courses') ,getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamps);

router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamps).delete(protect, authorize('publisher', 'admin'), deleteBootcamps);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), uploadPhotoToBootcamps);

module.exports = router;