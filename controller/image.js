const ImageModel = require("../model/image");

const getAllImages = async (req, res) => {
    const images = await ImageModel.find({});

    if (images.length < 1) {
        return res.status(404).json({ status: "Error", message: "No images found" });
    }
    return res.status(200).json({ status: "success", data: images });
}

const getImageById = async (req, res) => {
    const imageId = req.query.id

    const image = await ImageModel.findById(imageId)

    if (!image) {
        return res.status(404).json({ status: "error", message: "imageid not found" });
    }
    return res.status(200).json({ status: "success", data: image });
}

const uploadImage = async(req, res) => {
    return res.status(201).json({ message: "success", data: [] });
}

const deleteImageById = async(req, res) => {
    return res.status(200).json({ message: "success", data: [] });
}

module.exports = {
    getAllImages,
    getImageById,
    uploadImage,
}