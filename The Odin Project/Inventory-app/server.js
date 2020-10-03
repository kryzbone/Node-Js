require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");


const categorysRoute = require("./routes/categorysRoute");
const itemsRoute = require("./routes/itemsRoute");


const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

try{
    //setup mongo DB
    mongoose.connect(
        process.env.MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }, 
        () => console.log("DB Connected")
    );

}catch(err) {
    console.log(err)
}

const Category = require("./models/category")



app.set("views", "views")
app.set("view engine", "pug")

app.use("/categorys", categorysRoute);
app.use("/items", itemsRoute);

app.get("/" , (req, res, next) => {
   
    Category.find().exec((err, data) => {
        if(err) next(err);

        res.render("index", {title: "Welcome Select A Category", category: data})
    })
 
})



app.listen(port, () => console.log("Server is live..."))