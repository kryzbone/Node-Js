const router = require("express").Router();
const { authorValidator, results, bookValidator, genreValidator, signupValidator, loginValidator } = require("../utils/validation")
const { authorApiGet, authorApiGetOne, authorApiPost, authorApiDelete, authorApiEdit } = require("../controllers/authorApi")
const { bookApiGet, bookApiPost, bookApiGetOne, bookApiEdit, bookApiDelete } = require("../controllers/bookApi")
const { genreApiGet, genreApiGetOne, genreApiPost, genreApiDelete, genreApiEdit } = require("../controllers/genreApi")
const { signup, login } = require("../controllers/authentication")




//authentication routes
router.post("/signup", signupValidator(), results, signup )
router.post("/login", loginValidator(), results, login)


//author api routes
router.get("/authors", authorApiGet )
router.post("/authors", authorValidator(), results, authorApiPost)
router.get("/authors/:id", authorApiGetOne )
router.post("/authors/:id/edit", authorValidator(), results, authorApiEdit )
router.post("/authors/:id/delete", authorApiDelete )

//book api routes
router.get("/books", bookApiGet)
router.post("/books", bookValidator(), results, bookApiPost)
router.get("/books/:id", bookApiGetOne)
router.post("/books/:id/edit", bookValidator(), results, bookApiEdit)
router.post("/books/:id/delete", bookApiDelete)

//genre api routes
router.get("/genre", genreApiGet)
router.post("/genre", genreValidator(), results, genreApiPost)
router.get("/genre/:id", genreApiGetOne)
router.post("/genre/:id/edit", genreValidator(), results, genreApiEdit)
router.post("/genre/:id/delete", genreApiDelete)








module.exports = router
