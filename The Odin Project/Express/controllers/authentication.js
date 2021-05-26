require("dotenv/config")
const bcrypt  = require("bcrypt")
const User = require("../models/user")
const { generateToken } = require("../utils/auth")

//salts
const salt = parseInt(process.env.SALT)


//sign up route
exports.signup = (req, res, next) => {
    User.findOne({username: req.body.username}, (err, doc) => {
        if(err) return next(err);

        //user already exist
        if(doc) return res.status(200).json({ message: "Username is taken" })

        //hash password
        bcrypt.hash(req.body.password, salt, (err, hashed) => {
            if(err) return next(err)

            //Save User
            User({
                username: req.body.username,
                password: hashed
            })
            .save((err) => {
                if(err) return next(err);

                //on success
                res.status(201).json({ message: "User Created" })
            })

        })

    })
}


//login route
exports.login = (req, res, next) => {
    User.findOne({username: req.body.username}, (err, doc) => {
        if(err) return next(err)

        //if no doc
        if(!doc) return res.status(400).json({ message: "Username does not exist"})

        //check if password is valid
        bcrypt.compare(req.body.password, doc.password, (err, match) => {
            if(err) return next(err);

            //not a match
            if(!match) return res.status(400).json({ message: "Username/Password is incorrect" })

            //on match generate token
            try{
                //generate token
                const token = generateToken({ id: doc._id }) 

                res.status(200).json({ message: "Login successful", token })

            }catch (err) {
                next(err)
            }
            
        })
    })
}


