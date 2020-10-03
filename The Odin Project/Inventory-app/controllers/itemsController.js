const Item = require("../models/item");
const Category = require("../models/category");
const { body , validationResult } = require("express-validator");
const emitter = require("./categoryController").myEmitter;

//Data Cache
const temp = {};

//all items handler
exports.get_items = (req, res, next) => {
    //check if data is cached
    if(temp.items) {
        res.render("items", {title: "Items", items: temp.items})
        return
    }

    Item.find()
    .populate("category")
    .exec((err, data) => {
        if(err) next(err);
        //On success cache Data and render page
        temp.items = data
        res.render("items", {title: "Items", items: data})
    })
}

//Item detial Page
exports.single_item = (req, res, next) => {
    const id = req.params.id

    //check if item is cached
    if(temp[id]) {
        res.render("singleItem", {title: "item: ", item: temp[id]})
        return
    }

    Item.findById(id)
    .populate("category")
    .exec((err, doc) => {
        if(err) next(err)
        //item not found
        if(doc === null) {
            const err = Error("Item Not Found");
            err.status = 404;
            next(err)
        }
    
        //on success cache data and render page
        temp[doc._id] = doc
        res.render("singleItem", {title: "Item: ", item: doc})
    })
}


//create item form
exports.create_item_get = (req, res, next) => {
    //check for cached data
    if(temp.category) {
        res.render("createItem", {title: "Craete Item Form", categories: temp.Category }) 
    }

    Category.find()
    .then((doc) => {
        temp.category = doc
        res.render("createItem", {title: "Craete Item Form", categories: doc }) 
    })
    .catch(next)
}


// create item post handler
exports.create_item_post = [
    //Validate request body
    body("name", "Name Should Not Be Empty").isString().notEmpty().trim().escape(),
    body("description").optional({checkFalsy: true}).isString().escape().trim(),
    body("category").notEmpty().trim().escape(),
    body("price").notEmpty().withMessage("Please Provide Price").bail().toFloat()
    .exists({checkFalsy: true}).withMessage("Price Must be Numer").trim().escape(),
    body("quantity", "Please Enter Quantity").notEmpty().toFloat()
    .exists({checkFalsy: true}).withMessage("Quantity must be number").trim().escape(),

    //Create item post handler
    (req, res, next) => {
        //check for validation error
        const error = validationResult(req)
        if(!error.isEmpty()) {
            res.render("createItem", {title: "Create Item Form", data: req.body, categories: temp.category, errors: error.array()})
        }else {
            //clear category cached file 
            delete temp.category

            //create and save item to database
            const item = Item({
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                quantity: req.body.quantity
            })

            item.save()
            .then(doc => {
                //delete items cache and render page
                temp.items && delete temp.items
                emitter.emit("delItm")
                temp[doc._id] = doc
                res.redirect(doc.url)
            })
            .catch(next)
        }   

    }

]

exports.update_item_get = (req, res, next) => {
    res.send("<h1> Update items")
}

exports.update_item_post = (req, res, next) => {
    res.send("<h1>Redirect Update item succes")
}

exports.delete_item_get = (req, res, next) => {
    res.send("<h1> Delete items")
}

exports.delete_item_post = (req, res, next) => {
    res.send("<h1>redirect succes Delete item")
}