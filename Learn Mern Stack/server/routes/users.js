const router = require('express').Router();
const { User } = require('../db_models')

//get all users
router.get('/', (req, res) => {
    User.find()
    .then(data => {
        res.send(data)
    })
    .catch((err) => {
        res.status(400).json({ err })
    })
});


// add new user
router.post('/add', (req, res) => {
    const newUser = User({
        username: req.body.username
    })
    newUser.save()
    .then(data => {
        res.status(201).send('user created')
    })
    .catch((err) => {
        res.status(400).json({ err })
    })
});



module.exports = router