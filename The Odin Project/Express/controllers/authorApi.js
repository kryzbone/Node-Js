const { validationResult } = require("express-validator");
const Author = require("../models/author");


//get all wuthors
exports.authorApiGet = (req, res, next) => {
    Author.find().exec((err, doc) => {
        if(err) next(err)

        //on success
        res.json({
            data : doc
        })
    })
}


//get one author
exports.authorApiGetOne = (req, res, next) => {
    const id = req.params.id
    Author.findById(id).exec((err, doc) => {
        if(err) return next(err);

        //if no doc
        if(!doc) {
            const err =  Error("Author Not Found")
            err.status = 404
            return next(err)
        }

        //on success
        res.status(200).json({ data: doc })
    })
 
}


//create author
exports.authorApiPost = async (req, res, next) => {
    //check if author name 
    const exist = await Author.findOne(req.body)
    if(exist) return res.status(400).json({
        errors: {
            message: "author name already exist"
        }
    })

    //create new author
    Author({
        firstName: req.body.first_name,
        lastName: req.body.family_name
    })
    .save((err, doc) => {
        if(err) return next(err)

        //on success
        res.status(201).json({ message: "author created", data: doc })
    })
}


//edit author
exports.authorApiEdit = async (req, res, next) => {
    const id = req.params.id

    //check if author name 
    const exist = await Author.findOne( req.body )
    if(exist) return res.status(400).json({
        errors: {
            message: "author name already exist"
        }
    })


    //on success
    Author.findByIdAndUpdate(id, req.body, (err) => {
        if(err) next(err)
        
        res.status(201).json({
            message: "author updated"
        })
    })
}


exports.authorApiDelete = (req, res, next) => {
    const id = req.params.id
    Author.findByIdAndDelete(id, (err) => {
        if(err) next(err)

        res.status(200).json({ message: "author deleted" })
    })
}