const router = require('express').Router();
const staffController = require('../controller/staffController');
const { allowTo }       = require('../middleWares/roleMiddleWare');
const { authMiddleware } = require('../middleWares/authMiddleWare');

router.use(authMiddleware);
router.use(allowTo('admin'));   

router.get('/',    staffController.findAllStaff);
router.get('/:id', staffController.findStaffById);
router.post('/register',   staffController.registerStaff);
router.patch('/:id',                staffController.updateStaff);
router.patch('/:id/terminate',      staffController.terminateStaff);

module.exports = router;
