const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/users/:userId/following', userController.getFollowing);

router.get('/users/:userId/followers', userController.getFollowers);

router.get('/users/may-know', userController.getMayKnow);

router.post('/users/:userId/follow', userController.follow);

router.post('/users/:userId/unfollow', userController.unfollow);

router.get('/users/:userId', userController.getUser);

router.post('/posts', postController.createPost);

router.get('/posts', postController.getPostsForUser);

router.post('/users/:userId/remove', userController.removeFollower);

module.exports = router;