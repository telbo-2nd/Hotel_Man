const router = require("express").Router();
const hotelConfigController = require("../controller/hotelConfigController");
const { authMiddleware } = require("../middleWares/authMiddleWare");
const { allowTo } = require("../middleWares/roleMiddleWare");

router.use(authMiddleware);
router.use(allowTo("admin"));

// GET all configs — admin sees all settings
router.get("/", hotelConfigController.getAllConfigs);

// PATCH one config — admin updates one setting at a time
router.patch("/", hotelConfigController.updateConfig);

module.exports = router;