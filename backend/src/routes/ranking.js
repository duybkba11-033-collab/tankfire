const express = require('express');
const router = express.Router();
const controller = require('../controllers/rankingController');
const { asyncHandler } = require('../middleware/asyncHandler');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/ranking', verifyToken, asyncHandler(controller.listRanking));

module.exports = router;
