const express = require('express');
const { register, login, getMe } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');
// Auth route
router.route('/register').post(register);

router.route('/login').post(login);

router.route('/me').get(protect,getMe);

module.exports = router