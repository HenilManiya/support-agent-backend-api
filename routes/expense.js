const express = require('express');
const router = express.Router();

// controller
const expenseController = require('../controllers/expenseController');
const { middleware } = require('../middleware/middleware');


//user routes

router.get("/getexpense",middleware.auth, expenseController.getExpense);
// router.get("/getgroupbyid/:id",  middleware.auth, expenseController.getGroupById);
router.post("/addexpense",middleware.auth, expenseController.addExpense);
router.get("/getexpensebygroup/:id",middleware.auth, expenseController.getExpenseByGroup);
// router.get("/role-permission",  middleware.auth, expenseController.getRolesForPermission);
// router.put("/updategroup/:id",  middleware.auth, expenseController.updateGroup);

module.exports = router;