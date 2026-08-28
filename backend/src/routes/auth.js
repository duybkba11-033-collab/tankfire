const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { asyncHandler } = require('../middleware/asyncHandler');
const { loginRateLimit } = require('../middleware/loginRateLimit');

router.post('/register', asyncHandler(controller.register));
router.post('/login', loginRateLimit, asyncHandler(controller.login));

module.exports = router;
