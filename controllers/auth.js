const crypto = require('crypto')
const sendEmail = require('../utils/sendMail');
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

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetail
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next)=>{

    const updateField = {
        name: req.body.name,
        email: req.body.email
    }

    user = await User.findByIdAndUpdate(req.user.id, updateField, {
        new:true,
        runValidators: true
    })
    res.status(200).json({sucess: true, data: user});
})

// @desc    Update Password
// @route   PUT /api/v1/auth/me
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password')

    if(! (await user.matchPassword(req.body.currentPassword)) ){
        return next(new errorResponse(`Password is incorrect`), 401)
    }
    user.password = req.body.newPassword;

    await user.save()

    sendTokenResponse(user, 200, res)
})


// @desc    forgot password
// @route   POST /api/v1/auth/forgotpassword    
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next)=>{
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new errorResponse(`There is no user with this email`), 400)
    }

    const resetToken = user.getResetPasswordToken();
    
    await user.save({validateBeforeSave: false})

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you or someone else has requested to reset your password
    please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: `reset password email`,
            message
        })
        
        res.status(200).json({sucess: true, data: `email sent`});
    } catch (error) {
        console.log(error)
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false})
        return next(new errorResponse(`Email could not be sent`, 500))
    }
})

exports.resetPassword = asyncHandler(async (req, res, next) => {

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
  
    if (!user) {
      return next(new errorResponse('Invalid token', 400));
    }
  
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
  
    sendTokenResponse(user, 200, res);
  });
