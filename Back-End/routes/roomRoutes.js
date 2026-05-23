const router = require("express").Router();
const roomController = require("../controller/roomController.js");
const { authMiddleware } = require("../middleWares/authMiddleWare");
const { allowTo } = require("../middleWares/roleMiddleWare");

router.use(authMiddleware);
router.get("/available", allowTo("admin", "receptionist"), roomController.findAvailableRooms);
router.get("/",      allowTo("admin", "receptionist"), roomController.findAllRooms);
router.get("/:id",   allowTo("admin", "receptionist"), roomController.findRoomById);
router.post("/",     allowTo("admin"),                 roomController.createNewRoom);
router.patch("/:id", allowTo("admin", "receptionist"), roomController.updateRoomById); 
router.delete("/:id",allowTo("admin"),                 roomController.deleteRoomById);

module.exports = router;