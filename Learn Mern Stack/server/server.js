require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const server = require('http').createServer(app);



const exerRoute = require('./routes/exercise');
const usersRoute = require('./routes/users');
const port = process.env.PORT || 5000

//cors
function cors(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Aloww-Methods', 'GET, POST,PATCH,DELETE,PUT')
    if(req.method === 'OPTION') {
        res.sendStatus(200)
    }
    next()
}


//middlewares
app.use(express.json());
app.use(cors)


//connect to mongo db
mongoose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log('Connected to Mongo DB')
)

//route middleware
app.use('/exercise', exerRoute)
app.use('/users', usersRoute)

//main route



server.listen(port, () => console.log('lestening on port ' + port))