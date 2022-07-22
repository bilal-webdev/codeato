const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    address: String,
    contact: String,
    about: String,
    gender: String,
    avatar: {
        type: String,
        default: 'boy.png'
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }]
}, {timestamps: true})

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);