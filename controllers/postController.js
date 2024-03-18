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
    console.log(post.text)
    return res.status(200).json(post);
    }
  catch (err) {
    console.log(err);
  }
});

exports.getUserPosts = asyncHandler(async (req, res, next) => {
  try {
    const user = User.findById(req.query.userId);

     
  }
  catch (err) {
    console.log(err);
  }
})