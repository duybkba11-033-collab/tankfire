const express = require('express');
const router = express.Router();
const controller = require('../controllers/rankingController');

router.get('/ranking', controller.listRanking);

module.exports = router;
