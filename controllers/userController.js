const asyncHandler = require('express-async-handler');
const User = require('../models/user');

  exports.getMayKnow = asyncHandler(async (req, res, next) => {
    try {
      const { userId } = req.query;  
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({error: 'User not found'});
      }

      const notFollowed = await User.find({
        _id: { $ne: userId, $nin: user.followings }
      });

      return res.json(notFollowed);
    }
    catch(err) {
      console.error('Error while fetching users', err);
      return res.status(500).json({ error: 'Fetching error' });
    } 
  });

exports.getFollowings = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('followings');

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    const followings = user.followings;

    res.status(200).json(followings);
  }
  catch (err) {
    console.error(err);
  }
});

exports.follow = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { followedId } = req.query;

    const [ user, followed ] = await Promise.all([
      User.findById(userId),
      User.findById(followedId)
    ]);

    if (!user) {
      res.status(404).json({error: 'You need to log in'});
    }
    else if (!followed) {
      res.status(404).json({error: 'Profile not found'});
    }

    await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { followings: followed._id } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        followedId,
        { $addToSet: { followers: user._id } },
        { new: true }
      ) 
    ]);

    res.status(200).json({ message: 'Successfully followed user'});
  }
  catch (err) {
    console.error(err);
  }
});

exports.unfollow = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { followedId } = req.query;

    const [ user, followed ] = await Promise.all([
      User.findById(userId),
      User.findById(followedId)
    ]);

    if (!user) {
      res.status(404).json({error: 'You need to log in'});
    }
    else if (!followed) {
      res.status(404).json({error: 'Profile not found'});
    }

    await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $pull: { followings: followed._id } }
      ),
      User.findByIdAndUpdate(
        followedId,
        { $pull: { followers: user._id } }
      ) 
    ]);

    res.status(200).json({ message: 'Successfully followed user'});
  }
  catch (err) {
    console.error(err);
  }
});

exports.getUser = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        select: 'username'
      })
      .populate({
        path: 'followings',
        select: 'username'
      });

    res.status(202).json(user);
  }
  catch(err) {
    console.log(err.message);
  }
});