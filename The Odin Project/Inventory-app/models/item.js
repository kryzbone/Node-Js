const mongoose = require("mongoose");
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

//Item Schema 
const itemSchema = Schema({
    name: {
        type: String,
        trim: true,
        require: true,
        maclenght: 255,
    },
    description: {
        type: String,
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})


//Virtuals
itemSchema.virtual("url")
.get(function() {
    return "/item/" + this._id
});


module.exports = mongoose.Model("Items", itemSchema);