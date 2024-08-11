const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/users/:userId/following', passport.authenticate('jwt', {session: false}), userController.getFollowing);

router.get('/users/:userId/followers', passport.authenticate('jwt', {session: false}), userController.getFollowers);

router.get('/users/may-know', passport.authenticate('jwt', {session: false}), userController.getMayKnow);

router.post('/users/:userId/following', passport.authenticate('jwt', {session: false}), userController.follow);

router.delete('/users/:userId/following', passport.authenticate('jwt', {session: false}), userController.unfollow);

router.get('/users/:userId', passport.authenticate('jwt', {session: false}), userController.getUser);

router.post('/posts', passport.authenticate('jwt', {session: false}), postController.createPost);

router.get('/posts', passport.authenticate('jwt', {session: false}), postController.getPostsForUser);

router.delete('/users/:userId', passport.authenticate('jwt', {session: false}), userController.removeFollower);

router.post('/posts/:postId/likes', passport.authenticate('jwt', {session: false}), postController.handlePostLike);

router.get('/posts/:userId', passport.authenticate('jwt', {session: false}), passport.authenticate('jwt', {session: false}), postController.getUserPosts);

router.post('/posts/:postId/comment', passport.authenticate('jwt', {session: false}), postController.createComment);

router.get('/posts/:postId/comments', passport.authenticate('jwt', {session: false}), postController.getComments);

router.post('/comments/:commentId', passport.authenticate('jwt', {session: false}), postController.handleCommentLike);

router.post('/posts/:postId/forward', passport.authenticate('jwt', {session: false}), postController.handlePostForward);

module.exports = router;