const router = require("express").Router();
const staffStatusController = require("../controller/staffStatusController");
const { authMiddleware } = require("../middleWares/authMiddleWare");
const { allowTo } = require("../middleWares/roleMiddleWare");

router.use(authMiddleware);

// any authenticated staff
router.patch("/change",  staffStatusController.changeStatus);
router.get("/current",   staffStatusController.getCurrentStatus);
router.get("/history",   staffStatusController.getStatusHistory);

// admin only
router.get("/all",       allowTo("admin"), staffStatusController.getAllActiveStatuses);
router.get("/history/:userId", allowTo("admin"), staffStatusController.getStatusHistory);

module.exports = router;