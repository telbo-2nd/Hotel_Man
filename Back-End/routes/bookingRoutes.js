const router = require("express").Router();
const bookingController = require("../controller/bookingController.js");
const { authMiddleware } = require("../middleWares/authMiddleWare");
const { allowTo } = require("../middleWares/roleMiddleWare");

router.use(authMiddleware);

router.get("/",       allowTo("admin", "receptionist"), bookingController.findAllBookings);
router.get("/:id",    allowTo("admin", "receptionist"), bookingController.findBookingById);
router.post("/",      allowTo("admin", "receptionist"), bookingController.createNewBooking);
router.patch("/:id",  allowTo("admin", "receptionist"), bookingController.updateBookingById);
router.delete("/:id", allowTo("admin"),                 bookingController.deleteBookingById);

module.exports = router;