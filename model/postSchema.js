const mongoose = require('mongoose');
const { post } = require('../app');

const postSchema = new mongoose.Schema({
    postText: String,
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    dislike: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('post', postSchema);