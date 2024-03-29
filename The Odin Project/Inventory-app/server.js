require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");


const categorysRoute = require("./routes/categorysRoute");
const itemsRoute = require("./routes/itemsRoute");
const Category = require("./models/category")
const { emitter } =require("./utils")


//cache management
let temp = {}
emitter.on("flush", () => temp = {} )


const port = process.env.PORT || 3000;

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload())

try{
    //setup mongo DB
    mongoose.connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, 
        () => console.log("DB Connected")
    );

}catch(err) {
    console.log(err)
}



app.set("views", "views")
app.set("view engine", "pug")

app.use("/categorys", categorysRoute);
app.use("/items", itemsRoute);

app.get("/" , (req, res, next) => {
    //check if data is cached
    if(temp.cat) {
        res.render("index", {title: "Welcome Select A Category", category: temp.cat})
        return
    }
   
    Category.find().exec((err, data) => {
        if(err) next(err);
        temp.cat = data
        res.render("index", {title: "Welcome Select A Category", category: data})
    })
})


app.listen(port, () => console.log("Server is live.."))