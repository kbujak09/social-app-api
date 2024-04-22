const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

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
    
    const followingPosts = await Post.find({ author: { $in: followingIds }}).populate('author');

    return res.status(200).json(followingPosts);
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

    const posts = await Post.find({ author: userId }).populate('author');

    res.json(posts);
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

// exports.getPostComments = asyncHandler(async (req, res, next) => {
//   try {
//     const {}
//   }
// })