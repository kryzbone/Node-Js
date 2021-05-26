const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// Book instance Schema
const bookInstanceSchema = new Schema({
    book: { 
        type: Schema.Types.ObjectId, 
        ref: "Book",
        required: true 
    }, 
    imprint: {
        type: String, 
        required: true
    },
    status: {
        type: String, 
        required: true, 
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], 
        default: 'Maintenance'
    },
    due_back: {
        type: Date, 
        default: Date.now
    }
  }
);

// Virtual for bookinstance's URL
bookInstanceSchema
.virtual('url')
.get(function() {
  return '/catalog/bookinstance/' + this._id;
});



//Export model
// module.exports = mongoose.model('BookInstance', bookInstanceSchema);
try {
    module.exports = mongoose.model('BookInstance')
} catch (error) {
    module.exports = mongoose.model('BookInstance', bookInstanceSchema)
  }