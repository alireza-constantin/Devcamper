const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next)=>{

    res.status(200).json(res.advancedResult);
})

// @desc    Get a user
// @route   GET /api/v1/auth/user/:userId
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next)=>{

    const user = await User.findById(req.params.id)
    
    res.status(200).json({success: true, data: user})
})

// @desc    create a user
// @route   POST /api/v1/auth/user
// @access  Private/Admin
exports.createUsers = asyncHandler(async (req, res, next)=>{

    const user = await User.create(req.body)
    
    res.status(200).json({success: true, data: user})
})

// @desc    update a user
// @route   PUT /api/v1/auth/user/:userId
// @access  Private/Admin
exports.updateUsers = asyncHandler(async (req, res, next)=>{

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    
    res.status(200).json({success: true, data: user})
})

// @desc    delete a user
// @route   DELETE /api/v1/auth/user/:userId
// @access  Private/Admin
exports.deleteUsers = asyncHandler(async (req, res, next)=>{

    await User.findByIdAndDelete(req.params.id)
    
    res.status(200).json({success: true, data: {}})
})