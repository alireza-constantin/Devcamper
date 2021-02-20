const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for reviews'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Plesase add some text']
    },
    rating: {
        type: Number,
        max: 10,
        min: 1,
        required: [true, 'Plesase add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        require: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    }
})

// Average rating static method
ReviewSchema.statics.getAverageRating = async function(bootcampId){

    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group:{
                _id: '$bootcamp',
                averageRating: {$avg: '$rating'}
            }
        }
    ])
    // console.log(obj);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating 
        });
        
    } catch (error) {
        console.log(error)
    }
};

// Call getaverageRating after save
ReviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.bootcamp)
})

// Call getaverageRating befor remove 
ReviewSchema.pre('remove', function(){
    this.constructor.getAverageRating(this.bootcamp )
})


ReviewSchema.index({bootcamp: 1, user:1 }, { unique: true })

module.exports = mongoose.model('Review', ReviewSchema)