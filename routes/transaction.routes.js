const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');

router.get('/save', transactionController.saveData);
router.get('/byDate', transactionController.getByDate);
router.get('/list', transactionController.list);
router.get('/id/:tranId', transactionController.getById);
router.put('/update', transactionController.update);

module.exports = router;