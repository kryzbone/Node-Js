const mongoose = require('mongoose');

const Schema = mongoose.Schema

//Author Schema
const authorSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    dob: {
        type: Date
    },
    dod: {
        type: {},
        default: 'Present'
    }
})

//Author Model
module.exports = mongoose.model('Author', authorSchema)
