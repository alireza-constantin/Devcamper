const errorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next)=>{

    // Spread err Object and equal it to error
    let error = { ...err };
    error.message = err.message 
    
    // Console error for devs
    console.log(err);
    
    // Mongoose bad objectId
    if(err.name === 'CastError'){
        const message = `Resource not found`;
        error = new errorResponse(message, 404);
    }

    // Mongoose Duplicate error 
    if(err.code === 11000){
        const message = `Duplicate field value entred`;
        error = new errorResponse(message, 404);
    }
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new errorResponse(message, 400);
    }

    res.status(error.statusCode || 500).send({success: false, error: error.message || `Server Error`});
}

module.exports = errorHandler;