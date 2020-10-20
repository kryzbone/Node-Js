const Author = require('../models/author');
const async = require('async');
const Book = require('../models/book');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

// Display list of all Authors.
exports.author_list = (req, res, next) => {

    Author.find()
      .populate('author')
      .sort([['lastName', 'ascending']])
      .exec((err, list_authors) => {
        if (err) { 
            return next(err); 
        }
        console.log(list_authors[0].name)
        //Successful, so render
        res.render('author_list', { title: 'Author List', author_list: list_authors });
      });
  
};

// Display detail page for a specific Author.
exports.author_detail = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);

    async.parallel({
        author(callback) {
            Author.findById(id)
              .exec(callback)
        },
        authors_books(callback) {
          Book.find({ 'author': id },'title summary')
          .exec(callback)
        },
    }, (err, results) => {
        if (err) { return next(err); } // Error in API usage.
        if (results.author==null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
    });
};

// Display Author create form on GET.
exports.author_create_get = (req, res) => {
    res.render('author_form', { title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [

    // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.').escape(),
    body('lastName').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.').escape(),
    body('dob', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('dod', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

   
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            const author = new Author(
                {
                    firstName: req.body.first_name,
                    lastName: req.body.family_name,
                    dob: req.body.date_of_birth,
                    dod: req.body.date_of_death
                });
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];

// Display Author delete form on GET.
exports.author_delete_get = (req, res, next) => {

    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.author==null) { // No results.
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
    });

};

// Handle Author delete on POST.
exports.author_delete_post = (req, res, next) => {
    
    async.parallel({
        author: function(callback) {
          Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.body.authorid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/authors')
            })
        }
    });
};

// Display Author update form on GET.
exports.author_update_get = (req, res, next) => {

    Author.findById(req.params.id)
    .sort([['lastName', 'ascending']])
    .exec((err, author) => {
      if (err) { 
          return next(err); 
      }
      if (author==null) { // No results.
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }
      //Successful, so render
      res.render('author_form', { title: 'Update Author', author: author });
    });

};

// Handle Author update on POST.
exports.author_update_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.').escape(),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.').escape(),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

   
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Create an Author object with escaped and trimmed data.
        const author = {
                firstName: req.body.first_name,
                lastName: req.body.family_name,
                dob: req.body.date_of_birth,
                dod: req.body.date_of_death
            };

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            Author.findByIdAndUpdate(req.params.id, author, {}, (err, newAuthor) => {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(newAuthor.url);
            })
    
        }
    }
];
