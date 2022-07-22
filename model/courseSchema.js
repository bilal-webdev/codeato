const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    desc: String,
    title: String,
    subscribedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    pic: {
        type: String,
        default: 'bydefault.png'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('course', courseSchema);