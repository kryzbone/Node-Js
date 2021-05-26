const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const async = require('async');


//Welcome page
module.exports = (req, res) => {
    async.parallel({
        book_count(callback) {
            // Pass an empty object as match condition to find all documents of this collection
            Book.countDocuments({}, callback); 
        },
        book_instance_count(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count(callback) {
            Genre.countDocuments({}, callback);
        }
    }, (err, results) => {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};


