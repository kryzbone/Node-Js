const mongoose = require('mongoose');

const Schema = mongoose.Schema


// Genre schema 
const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    }
});

//Virtual Genre Url
genreSchema
.virtual('url')
.get(function() {
    return "/catalog/genre/" + this._id;
});

// Genre Model
module.exports = mongoose.model('Genre', genreSchema)
