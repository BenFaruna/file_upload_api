const mongoose = require("./setup");

const ImageSchema = new mongoose.Schema({
    url: String
});

const ImageModel = mongoose.model('image', ImageSchema);

module.exports = ImageModel;
