const express = require('express');
const app = express();
const mongoose = require('mongoose');


require('dotenv').config()
//connect to db
mongoose.connect(process.env.MONGODB_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, 
    () => console.log('connected to db') 
)



app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(5000, () => console.log('server is runnin....'))