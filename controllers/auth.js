const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendTokenResponse = require('../utils/sendTokenResponse')

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next)=>{

    const {name, email, password, role} = req.body
    const user = await User.create({
        name,
        email,
        password,
        role
    })
    
    sendTokenResponse(user, 200, res);
})

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next)=>{

    const { email, password } = req.body
    
    // Validate email and password
    if(!email || !password){
        return next(new errorResponse(`Please provide an email and password`), 400)
    }
    
    // Check for user 
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return next(new errorResponse(`Invalid credentials`), 401)
    }

    // Check for password
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return next(new errorResponse(`Invalid credentials`), 401)
    }

    sendTokenResponse(user, 200, res);
})

// @desc    Get logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user.id)

    if(!user){
        return next(new errorResponse(`User does not exists`), 400)
    }
    res.status(200).json({sucess: true, data: user});
})
