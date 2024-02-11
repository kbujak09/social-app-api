const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/:userId/followings', userController.getFollowings);

router.get('/users/may-know', userController.getMayKnow);

router.post('/:userId/follow', userController.follow);

module.exports = router;