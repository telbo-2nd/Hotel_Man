const router = require("express").Router();
const serviceController = require("../controller/serviceController.js");
const { authMiddleware } = require("../middleWares/authMiddleWare");
const { allowTo } = require("../middleWares/roleMiddleWare");

router.use(authMiddleware);

router.get("/",    allowTo("admin", "receptionist"), serviceController.findAllServices);
router.get("/:id", allowTo("admin", "receptionist"), serviceController.findServiceById);


router.post("/",      allowTo("admin"), serviceController.createNewService);
router.patch("/:id",  allowTo("admin"), serviceController.updateServiceById);
router.delete("/:id", allowTo("admin"), serviceController.deleteServiceById);

module.exports = router;