const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const mongoose = require('mongoose');
const validator = require('express-validator');


// Display list of all Genre.
exports.genre_list = (req, res, next) => {
    Genre.find()
    .then((result)=> {
        res.render('genre_list', {title: "Genre List", genres: result})
    })
    .catch(next);
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
   
    async.parallel({
        genre(callback) {
            Genre.findById(id)
              .exec(callback);
        },

        genre_books(callback) {
            Book.find({ 'genre': id })
              .exec(callback);
        },

    }, (err, results) => {
        if (err) { return next(err); }
        // No results
        if (results.genre==null) { 
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });

};

// Display Genre create form on GET.
exports.genre_create_get = (req, res) => {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
   
    // Validate that the name field is not empty.
    validator.body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
    
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validator.validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      
      const genre = new Genre(
        { name: req.body.name }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        Genre.findOne({ 'name': req.body.name })
          .exec( function(err, found_genre) {
             if (err) { return next(err); }
  
             if (found_genre) {
               // Genre exists, redirect to its detail page.
               res.redirect(found_genre.url);
             }
             else {
  
               genre.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(genre.url);
               });
  
             }
  
         });
      }
    }
  ];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {

  async.parallel({
      genre: function(callback) {
          Genre.findById(req.params.id).exec(callback)
      },
      genre_books: function(callback) {
        Book.find({ 'genre': req.params.id }).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.genre==null) { // No results.
          res.redirect('/catalog/genre');
      }
      console.log(results.genre_books)
      // Successful, so render.
      res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
  });

};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {

  async.parallel({
      genre: function(callback) {
        Genre.findById(req.body.genreid).exec(callback)
      },
      genre_books: function(callback) {
        Book.find({ 'genre': req.body.genreid }).exec(callback)
      },
  }, function(err, results) {
      if (err) { return next(err); }
      // Success
      if (results.authors_books.length > 0) {
          // Author has books. Render in same way as for GET route.
          res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
          return;
      }
      else {
          // Author has no books. Delete object and redirect to the list of authors.
          Author.findByIdAndRemove(req.body.genreid, (err) => {
              if (err) { return next(err); }
              // Success - go to author list
              res.redirect('/catalog/genre')
          })
      }
  });

};

// Display Genre update form on GET.
exports.genre_update_get = (req, res, next) => {
    Genre.findById(req.params.id)
    .exec((err, genre) => {
      if(err) next(err)
      if(genre == null) {
        const err = Error("Genre Not Found")
        err.status = 404
        return next(err);
      }
      //On Success
      res.render("genre_form", {title: "Update genre", genre })
    })
};

// Handle Genre update on POST.
exports.genre_update_post = [
   
  // Validate that the name field is not empty.
  validator.body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),
  
  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    // Create a genre object with escaped and trimmed data.
    
    const genre = { name: req.body.name }
    


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      Genre.findByIdAndUpdate(req.params.id, genre)
        .exec((err, found_genre) => {
          if (err) { return next(err); }

          res.redirect(found_genre.url);    
      });
    }
  }
];