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
const Author = mongoose.model('Author', authorSchema)


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
const Book = mongoose.model('Book', bookSchema)


// Genre schema 
const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    }
})

// Genre Model
const Genre = mongoose.model('Genre', genreSchema)

module.exports = { Author, Book, Genre }

