const jwt = require('jsonwebtoken');
const errorResponse = require('../utils/errorResponse')
const asyncHandler = require('./async');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next)=>{
    let token; 

    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];

    }; 
    
    /* else if (req.cookies.token){
        token = req.cookies.token
    } */

    // Make sure token exists
    if(!token){
        return next(new errorResponse(`Not authorized to access this route`, 401))
    }

    // Verify User
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id);
        next();
    } catch (error) {
        return next(new errorResponse(`Not authorized to access this route`, 401))
    }
})