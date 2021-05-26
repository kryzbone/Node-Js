const router = require("express").Router();
const itemController = require("../controllers/itemsController");


router.get("/", itemController.get_items)
router.get("/create", itemController.create_item_get)
router.post("/create", itemController.create_item_post)
router.get("/:id", itemController.single_item)
router.get("/:id/update", itemController.update_item_get)
router.post("/:id/update", itemController.update_item_post)
router.get("/:id/delete", itemController.delete_item_get)
router.post("/:id/delete", itemController.delete_item_post)



module.exports = router;