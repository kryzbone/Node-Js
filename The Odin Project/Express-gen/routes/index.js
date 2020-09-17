var express = require('express');
var router = express.Router();

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date()
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date()
  }
];

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express', messages });
});

//Post route
router.post('/new', (req, res, next) => {
  const { author, text } = req.body;
  //add to messages
  messages.push({ text, user: author, added: new Date() });
  res.redirect('/');
})

module.exports = router;
