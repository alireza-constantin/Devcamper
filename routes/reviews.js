const express = require('express');
const router = express.Router({mergeParams: true});

const { getReviews, getReview, addReview, deleteReview, updateReview } = require('../controllers/reviews');

// Import protect user functionality
const { protect, authorize } = require('../middleware/auth')

// Advanced result for pagination and select and etc
const advancedResult = require('../middleware/advancedResult');

// Course Model
const Review = require('../models/Review')

// Courese route
router.route('/')
    .get(advancedResult(Review,{
        path: 'bootcamp',
        select: 'name description'  
    }),getReviews)
    .post(protect, authorize('admin','user'), addReview)
    
router.route('/:id')
    .get(getReview)
    .put(protect, authorize('admin','user'), updateReview)
    .delete(protect, authorize('admin','user'), deleteReview)

module.exports = router;