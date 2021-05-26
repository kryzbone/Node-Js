const Category = require("../models/category");
const Item  = require("../models/item")
const async = require("async");
const { body, validationResult }  = require("express-validator");
const {emitter} = require("../utils")

//cache management
let temp = {}
emitter.on("flush", () => temp ={})

//all categories
exports.get_categories = (req, res, next) => {
    //check for cached data
    if(temp.categories) {
        res.render("category", {title: "Categories", category: temp.categories}) 
        return
    }

    Category.find().exec((err, data) => {
        if(err) next(err);
        temp.categories = data
        res.render("category", {title: "Categories", category: data})
    })
}


//Category Detail Page
exports.single_category = (req, res, next) => {
    const id = req.params.id

    //check for Cached data
    if(temp[id]) {
        const results = temp[id]
        res.render("singleCategory", {title: "Category: ", category: results.category, items: results.items  })
        return
    }
    
    async.parallel({
        items: (cb) => {
            Item.find({"category": id}).exec(cb);
        },
        category: (cb) => {
            Category.findById(id).exec(cb);
        } 

    }, (err, results) => {
        if(err) return next(err);
        //Category Not Fount
        if(results.category === null) {
            const err = Error("Category Not Found");
            err.status = 404;
            next(err)
            return
        }
        
        //On success cache data and render page
        temp[id] = results
        res.render("singleCategory", {title: "Category: ", category: results.category, items: results.items  })
    })
 
}


//Category creation form
exports.create_category_get = (req, res, next) => {
    res.render("createCategory", {title: "Create Item"})
}


//category Creation handler
exports.create_category_post = [
    //valitate request data
    body("name", "Please Provide Name").isString().notEmpty().trim().escape(),
    body("description").optional({ checkFalsy: true }).escape(),

    //request handler function
    (req, res, next) => {
        const error = validationResult(req);

        if(!error.isEmpty()) {
            res.render("createCategory",{ title: "Create Item", data: req.body, errors: error.array() })

        }else {
            //create And save category to Database
            const category = Category({
                name: req.body.name,
                description: req.body.description
            })

            //Save to database
            category.save()
            .then(doc => {
                //Flush cache and render page
                temp.categories && delete temp.categories
                emitter.emit("flush")
                res.redirect(doc.url)
            })
            .catch(next)
        }
        
    }
]


exports.delete_category_get = (req, res, next) => {
    const id = req.params.id

    async.parallel({
        category: (cb) => {
            Category.findById(id).exec(cb);
        },
        items: (cb) => {
            Item.find({"category" : id}).exec(cb)
        }
    }, (err, results) => {
        if(err) {
            console.log(err)
            return
        }

        if(results.category === null) {
            const err = Error("Category Not Found")
            err.status = 404
            next(err)
            return
        }
        res.render("categoryDelete", {title: "Delete Category: ", category: results.category, items: results.items})
    })

}

exports.delete_category_post = (req, res, next) => {
    const id = req.params.id

    Category.findByIdAndDelete(id)
    .then(() => {
        emitter.emit("flush")
        res.redirect("/categorys")
    } )
    .catch(next)
}

exports.update_category_get = (req, res, next) => {
    const id = req.params.id

    Category.findById(id)
    .then((doc) => {
        res.render("createCategory", {title: "Update Category: ", data: doc  })
    }) 
    .catch(next)
}

exports.update_category_post =[ 
    //valitate request data
    body("name", "Please Provide Name").isString().notEmpty().trim().escape(),
    body("description").optional({ checkFalsy: true }).escape(),

    //Upadate handler
    (req, res, next) => {
        const id = req.params.id

        const error = validationResult(req)

        if(!error.isEmpty()) {
            res.render("createCategory", {title: "Update Category: ", data: req.body, error: error.array()} )
        }else {
            const updated = {
                name: req.body.name,
                description: req.body.description
            }

            Category.findByIdAndUpdate({"_id": id}, updated)
            .then((doc) => {
                emitter.emit("flush")
                res.redirect(doc.url)
            })
            .catch(next)
        }
    }
]



