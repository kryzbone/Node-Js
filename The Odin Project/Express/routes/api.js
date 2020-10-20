const router = require("express").Router();
const { authorValidator, results } = require("../validation")
const { authorApiGet, authorApiGetOne, authorApiPost, authorApiDelete, authorApiEdit } = require("../controllers/authorApi")


//author api routes
router.get("/authors", authorApiGet )
router.post("/authors", authorValidator(), results, authorApiPost)
router.get("/authors/:id", authorApiGetOne )
router.post("/authors/:id/edit", authorValidator(), results, authorApiEdit )
router.post("/authors/:id/delete", authorApiDelete )











module.exports = router
