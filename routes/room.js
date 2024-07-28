const express = require('express');
const router = express.Router();

// controller
const roomController = require('../controllers/roomController');
const { middleware } = require('../middleware/middleware');


//user routes

router.get("/room",   middleware.auth,roomController.getRooms);
// router.post("/role", roleController.addRoles);
// router.get("/role-permission",  middleware.auth, roleController.getRolesForPermission);
// router.put("/update-role/:id",  middleware.auth, roleController.updateRolePermisson);

module.exports = router;