const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, maxLength: 120 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
  forwards: [{ type: Schema.Types.ObjectId, ref: 'Forward', default: [] }],
}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema);