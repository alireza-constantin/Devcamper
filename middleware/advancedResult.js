const advancedResult = (model, populate) => async(req, res, next)=>{
    let query;

    //Copy req.query 
    const reqQuery = {...req.query}
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'limit', 'page']

    // Loop over removeField and delete them from req.query
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let querystr = JSON.stringify(reqQuery)

    // Create operator ($gt, $lt, etc)
    querystr = querystr.replace(/\b(lt|lte|gte|gt|in)\b/g, match => `$${match}`);

    // Finding resource  
    query = model.find(JSON.parse(querystr));     
    // Select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }

    // Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('averageCost')
    }
    // Pagination 
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // population 
    query = query.populate(populate);

    // Executing query
    const result = await query
    // Pagination result
    const pagination = {}
    if( endIndex < total ){
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if( startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit
        }
    }

    res.advancedResult = {
        sucess: true,
        pagination,
        count: result.length,
        data: result
    }
    next();
}

module.exports = advancedResult;