const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, maxLength: 90 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User'}]
}, { timestamps: true })

module.exports = mongoose.model('Comment', CommentSchema);