const express = require('express');
const router = express.Router({mergeParams: true})
const User = require('../models/User')

const {getUsers, getUser, createUsers, updateUsers, deleteUsers} = require('../controllers/user')

// Middlewares
const { protect, authorize } = require('../middleware/auth');
const advancedResult = require('../middleware/advancedResult');



// Using middleware
router.use(protect);
router.use(authorize('admin'));

// Routes
router
    .route('/')
        .get(advancedResult(User), getUsers)
        .post(createUsers)

router
    .route('/:id')
    .put(updateUsers)
    .delete(deleteUsers)
    .get(getUser)

module.exports = router    