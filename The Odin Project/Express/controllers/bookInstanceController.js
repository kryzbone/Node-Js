const BookInstance = require('../models/bookInstance');
const Book = require("../models/book");
const async = require("async")
const mongoose = require("mongoose");
const { body, validationResult } = require('express-validator');


// Display list of all BookInstances.
exports.bookinstance_list = (req, res, next) => {
    
    BookInstance.find()
    .populate('book')
    .exec((err, list_bookinstances) => {
      if (err) { 
        return next(err); 
      }
      // Successful, so render
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);

    BookInstance.findById(id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('bookinstance_detail', { title: 'Copy: '+bookinstance.book.title, bookinstance:  bookinstance});
    })
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = (req, res) => {
    Book.find({},'title')
    .exec(function (err, books) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books});
    });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [

    // Validate fields.
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
    
    // Sanitize fields.
    body('status').trim().escape(),

    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        const bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id , errors: errors.array(), bookinstance: bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(bookinstance.url);
                });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = (req, res) => {

    BookInstance.findById(req.params.id)
    .exec((err, bookinstance) => {
        if (err) { return next(err); }
        if (bookinstance==null) { // No results.
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('bookinstance_delete', { title: 'Delete BookInstance ', instance:  bookinstance});
    })
    
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = (req, res) => {

    // Author has no books. Delete object and redirect to the list of authors.
    BookInstance.findByIdAndRemove(req.body.instanceid, (err) => {
        if (err) { return next(err); }
        // Success - go to author list
        res.redirect('/catalog/bookinstances')
    })
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
    async.parallel({
        books: (callback) => {
            Book.find().exec(callback);
        }, 
        instance: (callback) => {
            BookInstance.findById(req.params.id)
            .populate("book")
            .exec(callback)
        }
    }, (err, results) => {
            if(err) next(err);
            if(results.instance == null) {
                const err = Error("Book Instance Not found")
                err.status = 404
                return next(err)
            }
            console.log(results.books)
            //if success
            res.render("bookinstance_form", { title: "Update Bookinstance", book_list: results.books, bookinstance: results.instance })     
    });

};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [

    // Validate fields.
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
    
    // Sanitize fields.
    body('status').trim().escape(),

    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        const bookinstance = { 
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           };

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('bookinstance_form', { title: 'Update BookInstance', book_list: books, selected_book: bookinstance.book._id , errors: errors.array(), bookinstance: bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, (err, newInstance) => {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(newInstance.url);
            });
        }
    }
];