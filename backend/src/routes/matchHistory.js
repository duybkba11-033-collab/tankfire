const express = require('express');
const router = express.Router();
const controller = require('../controllers/matchHistoryController');

router.get('/match-history', controller.listMatchHistory);
router.get('/match-history/:match_id', controller.getMatchHistory);

module.exports = router;
