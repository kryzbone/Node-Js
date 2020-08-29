const router = require('express').Router()
const { Exercise } = require('../db_models')

//get Exercises
router.get('/', (req,res)=> {
    Exercise.find()
    .then(data => {
        res.send(data)
    })
    .catch((err) => {
        res.status(400).json({ err })
    })
});


//get exercises 
router.get('/:id', async (req, res) => {
    try {
        const data = await Exercise.findById(req.params.id)
        res.send(data)
    }catch(err) {
        res.json(err)
    }
})


//create exercise
router.post('/add', (req, res) => {
    const newExercise = Exercise({
        username: req.body.username,
        description: req.body.description,
        duration: Number(req.body.duration)
    })

    newExercise.save()
    .then(data => {
        res.status(201).send(data)
    })
    .catch((err) => {
        res.status(400).json({ err })
    })
});


//update exercise
router.patch('/:id', (req, res) => {
    Exercise.updateOne({_id: req.params.id}, {$set: req.body })
    .then(data => {
        res.json({ msg:"exercise updated", data })
    })
    .catch(err => res.json(err))
})


// delete exercise
router.delete('/:id', (req, res) => {
    Exercise.deleteOne({'_id': req.params.id})
    .then(data => {
        res.json({ msg:"exercise deleted", data})
    })
    .catch(err => res.json(err))
})


module.exports = router