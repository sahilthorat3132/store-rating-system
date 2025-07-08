const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const auth = require('../middleware/auth.middleware');

router.post('/:storeId', auth(['user']), ratingController.submitRating);
router.put('/:storeId', auth(['user']), ratingController.updateRating);
router.get('/mine', auth(['user']), ratingController.getMyRatings);

module.exports = router;
