const router = require("express").Router();
const { authorValidator, results, bookValidator } = require("../validation")
const { authorApiGet, authorApiGetOne, authorApiPost, authorApiDelete, authorApiEdit } = require("../controllers/authorApi")
const { bookApiGet, bookApiPost, bookApiGetOne, bookApiEdit, bookApiDelete } = require("../controllers/bookApi")

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








module.exports = router
