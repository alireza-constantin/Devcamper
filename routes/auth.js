const express = require('express');
const { register, login, logOut, getMe, 
        forgotPassword, resetPassword,
        updateDetails, updatePassword } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Auth route
router.post('/register', register)

router.post('/login', login);

router.get('/logout', logOut);

router.get('/me', protect, getMe);

router.put('/updatedetails', protect, updateDetails);

router.put('/updatepassword', protect, updatePassword);

router.post('/forgotpassword', forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);


module.exports = router