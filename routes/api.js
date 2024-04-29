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

router.post('/users/:userId/following', userController.follow);

router.delete('/users/:userId/following', userController.unfollow);

router.get('/users/:userId', userController.getUser);

router.post('/posts', postController.createPost);

router.get('/posts', postController.getPostsForUser);

router.delete('/users/:userId', userController.removeFollower);

router.post('/posts/:postId/likes', postController.handlePostLike);

router.get('/posts/:userId', postController.getUserPosts);

router.post('/posts/:postId/comment', postController.createComment);

router.get('/posts/:postId/comments', postController.getComments);

router.post('/comments/:commentId', postController.handleCommentLike);

router.post('/posts/:postId/forward', postController.handlePostForward);

module.exports = router;