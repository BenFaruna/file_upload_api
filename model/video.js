const mongoose = require("./setup");

const VideoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    transcript: String,
    words: [{
        word: String,
        start: Number,
        stop: Number,
    }]
});

const VideoModel = mongoose.model('video', VideoSchema);

module.exports = VideoModel;
