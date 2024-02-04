const asyncHandler = require('express-async-handler');
const User = require('../models/user');

exports.getNotFollowers = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.query;  
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    const notFollowers = await User.find({
      _id: { $ne: userId },
      followers: { $nin: user.followers }
    });

    return res.json(notFollowers);
  }
  catch(err) {
    console.error('Error while fetching users', err);
    return res.status(500).json({ error: 'Fetching error' });
  } 
});