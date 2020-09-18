require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const catalogRouter = require('./routes/catalog');

const port = 5000 || process.env.PORT;

//connect to db
mongoose.connect(process.env.MONGODB_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, 
    () => console.log('connected to db') 
);

//Routes
app.use('/catalog', catalogRouter);

app.get('/', (req, res) => {
    res.redirect('/catalog');
});


//Server Startup
app.listen(3000, () => console.log('server is runnin....'))