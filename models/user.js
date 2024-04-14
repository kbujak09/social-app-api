const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatars = 
    [
      'avatar1', 
      'avatar2', 
      'avatar3', 
      'avatar4', 
      'avatar5', 
      'avatar6', 
      'avatar7', 
      'avatar8'
    ]

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 16, minLength: 3 },
  password: { type: String, required: true, minLength: 8 },
  avatar: { type: String, required: true,     default: function() {
    return avatars[Math.floor(Math.random() * avatars.length)];
  }},
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  forwarded: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);