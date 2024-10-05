const express = require('express');
const router = express.Router();

// controller
const transactionController = require('../controllers/transactionController');
const { middleware } = require('../middleware/middleware');


//user routes

router.get("/gettransaction",middleware.auth, transactionController.getTransaction);
// router.get("/getgroupbyid/:id",  middleware.auth, expenseController.getGroupById);
router.post("/addexpense",middleware.auth, transactionController.addExpense);
router.get("/getexpensebygroup/:id",middleware.auth, transactionController.getExpenseByGroup);
// router.get("/role-permission",  middleware.auth, expenseController.getRolesForPermission);
router.put("/updatetransaction/:id",  middleware.auth, transactionController.updateTransaction);

module.exports = router;