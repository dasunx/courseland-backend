const mongoose = require('mongoose');

const CoursesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    slang: {
        type: String,
        required: true,
        unique: true
    },
    tags: {
        type: [String]
    },
    featuredImage: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Courses = mongoose.model('courses', CoursesSchema);
