const express = require('express');
const router = express.Router();
const controller = require('../controllers/matchHistoryController');
const { asyncHandler } = require('../middleware/asyncHandler');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/match-history', verifyToken, asyncHandler(controller.listMatchHistory));
router.get('/match-history/:match_id', verifyToken, asyncHandler(controller.getMatchHistory));

module.exports = router;
