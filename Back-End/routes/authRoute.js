const router = require("express").Router();
const { authMiddleware } = require("../middleWares/authMiddleWare");
const { allowTo } = require("../middleWares/roleMiddleWare");
const authController = require("../controller/authController");

// public
router.post("/login", authController.login);

// any authenticated user (admin, receptionist) can access these routes
router.get("/me",              authMiddleware, authController.getMe);
router.patch("/change-password", authMiddleware, authController.changePassword);

// admin only
router.post("/register",                   authMiddleware, allowTo("admin"), authController.register);
router.patch("/reset-password/:userId",    authMiddleware, allowTo("admin"), authController.resetUserPassword);

module.exports = router;