const mongoose = require('mongoose');

const Schema = mongoose.Schema


//Book Schema 
const bookSchema = new Schema({
    title: {
        type: String,
        require: true,
        trim: true,  
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
    },
    genre: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

//Book Model
module.exports = mongoose.model('Book', bookSchema)
