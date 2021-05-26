const { Schema, model } = require('mongoose')

//User Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 3
    }
})

//Exercise Schema
const exerSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

//creating user and exercise models
const User = model('User', userSchema);
const Exercise = model('Exercise', exerSchema);



module.exports = { User, Exercise };
