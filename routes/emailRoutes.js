const { Router } = require("express");
const { authenticateUser } = require('../services/authentication');
const { getemailVerification, postemailVerification,forgotPassword, postoptVerification, resetPassword} = require('../controllers/emailControllers')
const router = Router();


//email routes
router.post('/forgot-password', forgotPassword);

router.get('/email-Verification', getemailVerification );
router.post('/email-Verification', postemailVerification ) 

router.post('/otp-verification', postoptVerification);

router.post('/reset-password', resetPassword);

module.exports = router;

