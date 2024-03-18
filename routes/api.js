const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/users/:userId/followings', userController.getFollowings);

router.get('/users/may-know', userController.getMayKnow);

router.post('/users/:userId/follow', userController.follow);

router.post('/users/:userId/unfollow', userController.unfollow);

router.get('/users/:userId', userController.getUser);

router.post('/posts', postController.createPost);

module.exports = router;