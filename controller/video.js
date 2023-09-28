const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid").v4;
const ImageModel = require("../model/video");


const getAllImages = async (req, res) => {
    const images = await ImageModel.find({});

    if (images.length < 1) {
        return res.status(404).json({ status: "Error", message: "No images found" });
    }
    return res.status(200).json({ status: "success", data: images });
}


const getImageById = async (req, res) => {
    const imageId = req.params.id

    const image = await ImageModel.findById(imageId)

    if (!image) {
        return res.status(404).json({ status: "error", message: "imageid not found" });
    }
    return res.status(200).json({ status: "success", data: image });
}


const uploadImage = async (req, res) => {
    const file = req.files;
    
    await Object.keys(file).forEach(async key => {
        const name = uuidv4();
        const ext = path.extname(file[key].name);
        const imageName = name + ext;
        const filePath = path.join(__dirname, "..", "files", imageName);
        const image = new ImageModel({ url: filePath});
        await image.save()
            .then((data) => {
                file[key].mv(filePath)
                return res.status(201).json({ status: "success", data: data.toJSON() });
            })
            .catch((err) => {
                return res.status(500).json({ "error": err });
            });
    });
}


const deleteImageById = async(req, res) => {
    const videoId = req.params.id;

    const video = await ImageModel.findById(videoId)
        .then(async (data) => {
            fs.unlink(data.url, (err) => {
                if (err) {
                    throw new Error("Could not delete video from file storage");
                }
            });
            await data.deleteOne()
            return res.status(200).json({ status: "success", message: `${videoId} deleted` })
        })
        .catch((err) => {
            return res.status(500).json({ status: "error", message: err });
        })
    // return res.status(200).json({ message: "success", data: [] });
}


module.exports = {
    getAllImages,
    getImageById,
    uploadImage,
    deleteImageById,
}