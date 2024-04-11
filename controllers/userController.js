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
        _id: { $ne: userId, $nin: user.following }
      });

      return res.json(notFollowed);
    }
    catch(err) {
      console.error('Error while fetching users', err);
      return res.status(500).json({ error: 'Fetching error' });
    } 
  });

exports.getFollowing = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('following');

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    const following = user.following;

    res.status(200).json(following);
  }
  catch (err) {
    console.error(err);
  }
});

exports.getFollowers = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('followers');

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    const followers = user.followers;

    res.status(200).json(followers);
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
        { $addToSet: { following: followed._id } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        followedId,
        { $addToSet: { followers: user._id } },
        { new: true }
      ) 
    ]);

    res.status(200).json({ message: 'Successfully followed user', user: followed });
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
        { $pull: { following: followed._id } }
      ),
      User.findByIdAndUpdate(
        followedId,
        { $pull: { followers: user._id } }
      ) 
    ]);

    res.status(200).json({ message: 'Successfully unfollowed user'});
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
        path: 'following',
        select: 'username'
      });

    res.status(202).json(user);
  }
  catch(err) {
    console.log(err.message);
  }
});

exports.removeFollower = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { followerId } = req.query;

    console.log(userId, followerId)

    const [ user, follower ] = await Promise.all([
      User.findById(userId),
      User.findById(followerId)
    ]);

    if (!user) {
      res.status(404).json({error: 'You need to log in'});
    }
    else if (!follower) {
      res.status(404).json({error: 'Profile not found'});
    }

    await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $pull: { followers: follower._id } }
      ),
      User.findByIdAndUpdate(
        followerId,
        { $pull: { following: user._id } }
      ) 
    ]);

    console.log('pablo')
    res.status(200).json({ message: 'Successfully removed followers'});
  }
  catch (err) {
    console.log(err.message);
  }
})