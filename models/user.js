const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 16, minLength: 3 },
  password: { type: String, required: true, minLength: 8 },
  avatar: { type: String, required: true, default: randomAvatar()},
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

function randomAvatar() {
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
    return avatars[Math.floor(Math.random() * 8) + 1];
}

module.exports = mongoose.model('User', UserSchema);