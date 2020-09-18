const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// Book instance Schema
const bookInstanceSchema = new Schema({
    book: { 
        type: Schema.Types.ObjectId, 
        ref: 'Book', required: true 
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


//Export model
module.exports = mongoose.model('BookInstance', bookInstanceSchema);