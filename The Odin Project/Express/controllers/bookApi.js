const Book = require("../models/book")


//get all books
exports.bookApiGet = (req, res, next) =>  {
    Book.find()
    .populate(["author", "genre"])
    .exec((err, doc) => {
        if(err) return next(err);

        //on success
        res.status(200).json({ data: doc })
    })
}

exports.bookApiPost = (req, res, next) =>  {
    //check if book already exist in database
    Book.findOne({title: req.body.title, author: req.body.author}, (err, doc) => {
        if (err) return next(err)

        if(doc) return res.status(200).json({ message: "Book Already Created" })
    })

    Book(req.body) 
    .save((err, doc) => {
        if(err) return next(err);

        //on success
        res.status(201).json({
            message: "Book Created",
            data: doc
        })
    })
}

exports.bookApiGetOne = (req, res, next) =>  {
    const id = req.params.id;

    Book.findById(id)
    .populate(["author", "genre"])
    .exec((err, doc) => {
        if(err) return next(err);

        if(!doc) {
            const err = Error("Book Not Available")
            err.ststus = 404
            return next(err)
        }

        //on success
        res.status(200).json({
            data: doc
        })
    })
    
}

exports.bookApiEdit = async (req, res, next) =>  {
    const id = req.params.id

    try{
        const update = await Book.findById(id)

        //no book
        if(!update) {
            const err = Error("Book Not Found")
            err.status = 404
            return next(err)
        }

        //update book
        update.title = req.body.title;
        update.author = req.body.author
        update.summary = req.body.summary
        update.genre = req.body.genre || []

        //save
        const doc = await update.save()

        res.status(200).json({ message: "Update successful", data: doc })

    }catch(err) {
        return  next(err)
    }

}

exports.bookApiDelete = (req, res, next) =>  {
    const id = req.params.id

    Book.findByIdAndDelete(id, (err, doc) => {
        if(err) return next(err)

        if(!doc) {
            const err = Error("Book Not Available")
            err.ststus = 404
            return next(err)
        }

        res.status(200).json({ message: "Book Deleted Successfully" })
    })
    
}