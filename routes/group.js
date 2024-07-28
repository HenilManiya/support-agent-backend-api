const express = require('express');
const router = express.Router();

// controller
const groupController = require('../controllers/groupController');
const { middleware } = require('../middleware/middleware');


//user routes

router.get("/getgroup",middleware.auth, groupController.getGroup);
router.get("/getgroupbyid/:id",  middleware.auth, groupController.getGroupById);
router.post("/addgroup",middleware.auth, groupController.addGroup);
router.get("/role-permission",  middleware.auth, groupController.getRolesForPermission);
router.put("/updategroup/:id",  middleware.auth, groupController.updateGroup);

module.exports = router;