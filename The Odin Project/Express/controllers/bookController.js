const Book = require('../models/book');
const async = require("async");
const mongoose = require('mongoose');

// Display list of all books.
exports.book_list = (req, res, next) => {
    
    Book.find({}, 'title author')
    .populate('author')
    .exec((err, list_books) => {
      if (err) { 
        return next(err); 
      }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });
};

// Display detail page for a specific book.
exports.book_detail = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);

    async.parallel({
        book(callback) {

            Book.findById(id)
              .populate('author')
              .populate('genre')
              .exec(callback);
        },
        book_instance(callback) {

          BookInstance.find({ 'book': id })
          .exec(callback);
        },
    }, (err, results) => {
        if (err) { return next(err); }
        if (results.book==null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance } );
    });
};

// Display book create form on GET.
exports.book_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Book update POST');
};