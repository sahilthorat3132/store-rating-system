const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
console.log("typeof auth:", typeof auth);

// ✅ All admin routes use this pattern
router.get('/dashboard', auth(['admin']), adminController.dashboard);
router.get('/users', auth(['admin']), adminController.getUsers);
router.get('/stores', auth(['admin']), adminController.getStores);
router.get('/owners', auth(['admin']), adminController.getStoreOwners);
router.post('/stores', auth(['admin']), adminController.createStore);
router.post('/users', auth(['admin']), adminController.createUser);
module.exports = router;
