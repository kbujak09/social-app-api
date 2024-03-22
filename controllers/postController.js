const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const User = require('../models/user');

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
    console.log(err);
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
    console.log(err);
  }
});