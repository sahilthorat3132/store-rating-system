const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const auth = require('../middleware/auth.middleware'); // this is okay if above is correct

router.get('/', auth(['user']), storeController.getAllStores);
router.get('/my', auth(['owner']), storeController.getStoreRatingsForOwner);
router.get('/owner-ratings', auth(['owner']), storeController.getRatingsByOwner);
module.exports = router;
