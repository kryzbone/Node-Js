const Genre = require("../models/genre")

//get all genre
exports.genreApiGet = (req, res, next) => {
    
    Genre.find({}, "name _id").exec((err, doc) => {
        if(err) return next(err);

        //on success
        res.status(200).json({ data: doc })
    })
}

//create genre
exports.genreApiPost = (req, res, next) => {
    //check if genre already exists
    Genre.findOne({name: req.body.name}, (err, doc) => {
        if(err) return next(err)

        if(doc) return res.status(200).json({ message: "Genre already exists" })
    })


    //save genre
    Genre({
        name: req.body.name
    })
    .save((err, doc) => {
        if(err) return next(err);

        //on succcess
        res.status(201).json({
            message: "Genre Created",
            data: doc
        })
    })
}

//genre details
exports.genreApiGetOne = (req, res, next) => {
    const id = req.params.id;

    Genre.findById(id, "name _id", (err, doc) => {
        if(err) return next(err);

        //if no doc found
        if(!doc) {
            const err = Error("Genre Not Found");
            err.status = 404;
            return next(err)
        }

        //on success
        res.status(200).json({
            data: doc
        })
    })
}


//edit genre
exports.genreApiEdit = async (req, res, next) => {
    const id = req.params.id;

    Genre.findById(id, (err, doc) => {
        if(err) return next(err);

        if(doc) {
            doc.name = req.body.name
        }else {
            const err = new Error("Genre Not found")
            err.status = 404
            return next(err)
        }

        //save updated doc
        doc.save((err, newDoc) => {
            if(err) return next(err)

            //on success
            res.status(200).json({ messgae:"Genre Updated successfuly", data: newDoc})
        })
    })


}


//delete genre
exports.genreApiDelete = (req, res, next) => {
   const id = req.params.id;
   
   Genre.findByIdAndDelete(id, (err, doc) => {
       if(err) return next(err);

       //no doc
       if(!doc) return res.status(404).json({
           error: "Genre Not Found"
       }) 

       res.status(200).json({
           message: "Genre Deleted"
       })
   })
   
}




