const router = require("express").Router();
const dashboardController = require("../controller/dashboardController");
const { authMiddleware } = require("../middleWares/authMiddleWare");
const { allowTo } = require("../middleWares/roleMiddleWare");

router.use(authMiddleware);

// admin gets full stats
router.get("/admin",allowTo("admin"), dashboardController.getAdminDashboard);

// receptionist gets operational view
router.get("/receptionist", allowTo("admin", "receptionist"), dashboardController.getReceptionistDashboard);

module.exports = router;