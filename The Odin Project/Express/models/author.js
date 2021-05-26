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

// Virtual for author's full name
authorSchema
.virtual('name')
.get(function() {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case

  let fullname = '';
  if (this.firstName && this.lastName) {
    fullname = this.lastName + ' ' + this.firstName
  }

  return fullname;
});

// Virtual for author's lifespan
authorSchema
.virtual('lifespan')
.get(function() {
  if( this.dod instanceof Date &&  this.dob) {
    const d = new Date();
    return ((this.dod instanceof Date?  this.dod.getYear() : d.getYear()) - this.dob.getYear()).toString();
  }
  
});

// Virtual for author's URL
authorSchema
.virtual('url')
.get(function()  {
  return '/catalog/author/' + this._id;
});



//Author Model
module.exports = mongoose.model('Author', authorSchema)
