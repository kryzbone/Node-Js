const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.get_categories)

router.get("/create", categoryController.create_category_get)
router.post("/create", categoryController.create_category_post)
router.get("/:id", categoryController.single_category)
router.get("/:id/update", categoryController.update_category_get)
router.post("/:id/update", categoryController.update_category_post)
router.get("/:id/delete", categoryController.delete_category_get)
router.post("/:id/delete", categoryController.delete_category_post)


module.exports = router