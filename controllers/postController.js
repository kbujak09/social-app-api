const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Forward = require('../models/forward');

exports.createPost = asyncHandler(async (req, res, next) => {
  try {
    const author = await User.findById(req.body.author);
    const text = req.body.text;

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const post = new Post({
      author: author,
      text: text
    });

    await post.save();

    author.posts.push(post._id);

    await author.save();

    return res.status(200).json(post);
    }
  catch (err) {
    console.error(err);
  }
});

exports.getPostsForUser = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.query;

    const user = await User.findById(userId).populate('following');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followingIds = user.following.map(user => user._id);

    const userPosts = await Post.find({ author: userId }).populate(['forwards', 'author']);

    const followingPosts = await Post.find({ author: { $in: followingIds }}).populate(['forwards', 'author']);

    const followingForwards = await Forward.find({ author: { $in: followingIds }}).populate([{ path: 'post', populate: ['forwards', 'author'] }, 'author']);

    const unsortedData = [...followingPosts, ...followingForwards, ...userPosts];

    const sortByCreatedAt = (array) => {
      return array.sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1;
        if (a.createdAt > b.createdAt) return -1;
        return 0;
      });
    }

    const sortedData = sortByCreatedAt(unsortedData);

    return res.status(200).json(sortedData);
  }
  catch (err) {
    console.error(err);
  }
});

exports.handlePostLike = asyncHandler(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;

    const post = await Post.findById(postId);

    if (post.likes.includes(userId)) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId }});
    }
    else {
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
    }

    return res.json(post);
  }
  catch (err) {
    console.error(err);
  }
});

exports.getUserPosts = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId }).populate(['author', 'forwards']);

    const sorted = posts.sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });

    return res.json(sorted);
  }
  catch (err) {
    console.error(err);
  }
});

exports.createComment = asyncHandler(async (req, res, next) => {
  try {
    const { postId } = req.params;

    const user = await User.findById(req.body.author);

    const comment = new Comment({
      author: user,
      text: req.body.text
    });

    await Post.updateOne({ _id: postId }, { $push: { comments: comment }});

    await comment.save();

    return res.json(comment);
  }
  catch (err) {
    console.error(err);
  }
});

exports.getComments = asyncHandler(async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate({
      path: 'comments',
      populate: { path: 'author'}
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = post.comments.sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });

    res.status(200).json(comments);
  }
  catch (err) {
    console.error(err);
  }
});

exports.handleCommentLike = asyncHandler(async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.query;

    const comment = await Comment.findById(commentId);

    if (comment.likes.includes(userId)) {
      await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId }});
    }
    else {
      await Comment.updateOne({ _id: commentId }, { $push: { likes: userId } });
    }

    return res.json(comment);
  }
  catch (err) {
    console.error(err);
  }
});

exports.handlePostForward = asyncHandler(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;

    const [ post, user ] = await Promise.all([
      await Post.findById(postId),
      await User.findById(userId)
    ]);

    const existingForward = await Forward.findOne({ post: postId, author: userId });

    if (existingForward) {
      await Post.updateOne({ _id: postId }, { $pull: { forwards: existingForward._id } });

      await Forward.findByIdAndDelete(existingForward._id);

      return res.json(post);
    }

    const forward = new Forward({
      author: user,
      post: post
    });

    await Post.updateOne({ _id: postId }, { $push: { forwards: forward }});

    await forward.save();

    return res.json(post);
  }
  catch (err) {
    console.error(err);
  }
});