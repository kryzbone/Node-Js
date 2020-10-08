require("dotenv/config");
const express = require("express");
const app = express()
const server = require("http").createServer(app)

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {Schema, model} = mongoose;
const { body, validationResult } = require("express-validator");
const { isString } = require("util");


const port = process.env.PORT || 3000;
const saltRound = 13;

//Mongo DB setup
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => console.log("db connected"))

//mongo db user schema
const userSchema = new Schema({
    username: { type: String, required: true },
    password: {type: String, required: true }
})

//mongo db model
const User = model("User", userSchema);


//passport set-up
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, 
(username, password, done) => {
    //find user in database
    User.findOne({username: username}, (err, user) => {
        if(err) return done(err)

        if(user) {
            //check if password is valid
           bcrypt.compare(password, user.password, (err, match) => {
               if(err) return done(err);

               if(match) return done(null, user)

               done(null, false, {message: "Invalid Email or Password"} )
           })

        } else done(null, false, {message: "Invalid Email or Password"} )
    })
}))

passport.serializeUser((user, done) => done(null, user._id))

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

//User data validation and sanitization
const validator = [
    body("email").notEmpty().withMessage("Provide Email").isEmail().withMessage("Not an Email").trim().escape(),
    body("password").notEmpty().withMessage("Enter Password").isLength({min: 3}).withMessage("password min 6 ").isString().escape(),
]




app.set("views", "views")
app.set("view engine", "ejs")

app.use(express.urlencoded({extended: true}))
app.use(express.json({limit:"1mb"}));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

//setup locals object
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

//Index Route
app.get("/", (req, res) => {
    res.render("index", {errors: false})
})


//sign up form
app.get("/signup", (req, res) => {
    res.render("signupForm", {errors: false})
})


//sign up route
app.post("/signup", validator, async (req, res, next) => {
    //check for validation error
    const error = validationResult(req)

    if(error.isEmpty()) {
        const username = req.body.email,
              password = req.body.password
        try{
            //check if user already exist
            const exist = await User.findOne({ username })
        
            if(exist) {
               return res.render("signupForm", {errors: ["Email Already exist"]})
            }

            //hash password
            const hashed = await bcrypt.hash(password, saltRound)

            //create new user
            const user = User({
                username,
                password: hashed
            })
            await user.save()

            //on success
            res.redirect("/")

        }catch (err) {
            res.render("signupForm", {errors: error.array()})
        }
    }
    
})


//log in route
app.post("/login", (req, res, next ) => {

    //using custom callbacks
    passport.authenticate("local", (err, user, info) => {
        if(err) return next(err);

        if(user) {
            req.logIn(user, (err) => {
                if(err) return next(err)

                //on success
                res.redirect("/")
            })
        }else {
            console.log(info)
            res.render("index", {errors: info})
        }

    })(req, res, next) 

})

//logout
app.get("/logout", (req, res) => {
    req.logOut()
    res.redirect("/")
})

server.listen(port, () => console.log("Server is live"))