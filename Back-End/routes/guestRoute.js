const router = require("express").Router();
const guestController = require("../controller/guestController.js");
const { allowTo } = require("../middleWares/roleMiddleWare");
const { authMiddleware } = require("../middleWares/authMiddleWare");

router.use(authMiddleware);

router.get("/",    allowTo("admin", "receptionist"), guestController.findAllGuests);
router.get("/:id", allowTo("admin", "receptionist"), guestController.findGuestById);
router.post("/",   allowTo("admin", "receptionist"), guestController.createNewGuest);
router.patch("/:id", allowTo("admin", "receptionist"), guestController.updateGuestById); 
router.delete("/:id", allowTo("admin"),              guestController.deleteGuestById);

module.exports = router;