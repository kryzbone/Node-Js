require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const catalogRouter = require('./routes/catalog');
const apiRouter = require("./routes/api.js")

const port = 5000 || process.env.PORT;

//cors
const cors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Acces-Control-Allow-Methods", "GET, POST, PUT, DELETE")

    if(req.method === "OPTION") {
        res.sendStatus(200)
    }
    next()
}

app.use(express.json());
app.use(express.urlencoded({"extended": true}))
app.use(cors);

//connect to db
mongoose.connect(process.env.MONGODB_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, 
    () => console.log('connected to db') 
);


// View engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Static files
app.use(express.static(path.join(__dirname + '/public')));


//Routes
app.use('/api', apiRouter)
app.use('/catalog', catalogRouter);
app.get('/', (req, res) => {
    res.redirect('/catalog');
});


//error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500 ).json({
        error: {
            message : error.message
        }
    })
})


//Server Startup
app.listen(port, () => console.log('server is runnin....'))