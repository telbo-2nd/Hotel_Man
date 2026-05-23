const router = require("express").Router();
const roomTypeController = require("../controller/roomTypeController.js");
const { authMiddleware } = require("../middleWares/authMiddleWare"); 
const { allowTo } = require("../middleWares/roleMiddleWare");        

router.use(authMiddleware);

router.get("/",     roomTypeController.findAllRoomTypes);
router.get("/:id",  roomTypeController.findRoomTypeById);
router.post("/",    roomTypeController.createNewRoomType);
router.patch("/:id", roomTypeController.updateRoomTypeById); 
router.delete("/:id", roomTypeController.deleteRoomTypeById);

module.exports = router;