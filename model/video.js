const mongoose = require("./setup");

const VideoSchema = new mongoose.Schema({
    url: String
});

const VideoModel = mongoose.model('video', VideoSchema);

module.exports = VideoModel;
