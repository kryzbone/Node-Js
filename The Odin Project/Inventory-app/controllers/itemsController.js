const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body , validationResult } = require("express-validator");
const { emitter } = require("../utils");
const crypto = require("crypto")
const fs = require("fs")

let temp = {}
emitter.on("flush", () => temp ={})

//all items handler
exports.get_items = (req, res, next) => {
    console.log(temp)
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
        console.log(doc)
        temp[doc._id] = doc
        res.render("singleItem", {title: "Item: ", item: doc})
    })
}


//create item form
exports.create_item_get = (req, res, next) => {
    //check for cached data
    if(temp.category) {
        res.render("createItem", {title: "Craete Item Form", categories: temp.category }) 
        return
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
        //handle file upload
        let filename;
        if(req.files) {
            const ran = crypto.randomBytes(5).toString("hex")
            const img = req.files.image;
            const mime = img.mimetype.split("/")[1]
            //check if file is image
            filename = (mime === "png" || mime === "jpeg") ? ran + "-" + img.name : ""
            //move image if any
            if(filename) {
                img.mv("public/uploads/"+filename, (err) => {
                    if(err) {
                        filename = ""
                        return
                    }
                    console.log("file uploaded")
                })
            }
        }
        

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
                quantity: req.body.quantity,
                image: filename? "/uploads/"+filename : "/uploads/image.png"
            })

            item.save()
            .then(doc => {
                //delete items cache and render page
                emitter.emit("flush")
                temp[doc._id] = doc
                res.redirect(doc.url)
            })
            .catch(next)
        }   

    }

]

exports.update_item_get = (req, res, next) => {
    const id = req.params.id

    async.parallel({
        item: (cb) => {
            Item.findById(id).exec(cb)
        },
        categories: (cb) => {
            Category.find() .exec(cb)
        }
    }, (err, results) => {
        if(err) return async.nextTick(err)

        if(results.item ==null) {
            const err = Error("Item Not Found");
            err.status = 404;
            return  next(err)
        }

        //on success
        temp.update = results
        res.render("createItem", {title: "Update Item", data: results.item, categories: results.categories})
    })
}

//update item Post
exports.update_item_post = [
    //validate data
    body("name", "Name Should Not Be Empty").isString().notEmpty().trim().escape(),
    body("description").optional({checkFalsy: true}).isString().escape().trim(),
    body("category").notEmpty().trim().escape(),
    body("price").notEmpty().withMessage("Please Provide Price").bail().toFloat()
    .exists({checkFalsy: true}).withMessage("Price Must be Numer").trim().escape(),
    body("quantity", "Please Enter Quantity").notEmpty().toFloat()
    .exists({checkFalsy: true}).withMessage("Quantity must be number").trim().escape(),

    (req, res, next) => {
        const id = req.params.id;

        //handle file upload
        let filename;
        if(req.files) {
            const ran = crypto.randomBytes(5).toString("hex")
            const img = req.files.image;
            const mime = img.mimetype.split("/")[1]
            //check if file is image
            filename = (mime === "png" || mime === "jpeg") ? ran + "-" +img.name : ""
            //move image if any
            if(filename) {
                img.mv("public/uploads/"+filename, (err) => {
                    if(err) {
                        filename = ""
                        return
                    }
                    //delete old image if any
                    if(temp.update.image && temp.update.image !== "/uploads/image.png") {
                        fs.unlink("public/uploads/"+temp.update.image, (err) =>{
                            if(!err) console.log("Old file removed")
                        })
                    }
                    //on success
                    console.log("New file uploaded")
                })
            }
        }else {
            filename = temp.update.item.image
        }

        const error = validationResult(req);

        if(!error.isEmpty()) {
            res.render("createItem", {title: "Update Item", data: req.body, categories: temp.update.categories, errors: error.array()})   
        }else {
            //updated data
            const updated = {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                quantity: req.body.quantity,
                image: filename? filename : "/uploads/image.png"
            }

            Item.findOneAndUpdate({"_id": id}, updated)
            .then((doc) => {
                emitter.emit("flush")
                res.redirect(doc.url)
            })
            .catch(next)
        }
    }

]


//Delete Get
exports.delete_item_get = (req, res, next) => {
    const id = req.params.id
    
    Item.findById(id)
    .then(data => {
        res.render("itemDelete", { title:"Delete Item: ", item: data })
    })

}

//Delete Post
exports.delete_item_post = (req, res, next) => {
    const id = req.params.id

    Item.findByIdAndDelete(id)
    .then(() => {
        emitter.emit("flush")
        res.redirect("/items")
    }) 
    .catch(next)
}