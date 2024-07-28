const express = require('express');
const router = express.Router();

// controller
const roleController = require('../controllers/roleController');
const { middleware } = require('../middleware/middleware');


//user routes

router.get("/role", roleController.getRoles);
router.post("/role", roleController.addRoles);
router.get("/role-permission",  middleware.auth, roleController.getRolesForPermission);
router.put("/update-role/:id",  middleware.auth, roleController.updateRolePermisson);

module.exports = router;