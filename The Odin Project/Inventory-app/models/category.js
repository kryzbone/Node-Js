const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//category Schema
categorySchema = Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlenght: 255
    },
    description: {
        type: String,
    }
})



categorySchema.virtual("url")
.get(function () {
    return "/category/" + this._id
})


module.exports = mongoose.Model("Category", categorySchema);
