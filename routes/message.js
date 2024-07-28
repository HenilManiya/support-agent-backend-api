const express = require('express');
const router = express.Router();

// controller
const roomController = require('../controllers/roomController');
const messageController = require('../controllers/messageController');
const { middleware } = require('../middleware/middleware');


//user routes

router.get("/get-message/:roomId",   middleware.auth,messageController.getMessageHistory);
// router.post("/role", roleController.addRoles);
// router.get("/role-permission",  middleware.auth, roleController.getRolesForPermission);
// router.put("/update-role/:id",  middleware.auth, roleController.updateRolePermisson);

module.exports = router;