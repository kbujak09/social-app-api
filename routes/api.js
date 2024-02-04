const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/users/not-followers', userController.getNotFollowers);

module.exports = router;