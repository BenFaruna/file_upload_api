const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid").v4;
const ImageModel = require("../model/video");

const sendVideoDetailToQueue = require("../utils/sender");


const getVideoFile = async (req, res) => {
    const filePath = req.params.path
    console.log(path.join(__dirname, "..", filePath))
    return res.sendFile(path.join(__dirname, "..", "files", filePath))
}


const getAllVideos = async (req, res) => {
    const images = await ImageModel.find({});

    if (images.length < 1) {
        return res.status(404).json({ status: "Error", message: "No video found" });
    }
    return res.status(200).json({ status: "success", data: images });
}


const getVideoById = async (req, res) => {
    const imageId = req.params.id

    ImageModel.findById(imageId)
        .then((data) => {
            if (!data) {
                throw new Error("imageid not found");
            }
            return res.status(200).json({ status: "success", data });
        })
        .catch((err) => {
            return res.status(404).json({ status: "error", message: "imageid not found" });
        })
    }


const uploadVideo = async (req, res) => {
    const file = req.files;
    
    await Object.keys(file).forEach(async key => {
        const name = uuidv4();
        const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT}/`
        const ext = path.extname(file[key].name);
        const imageName = name + ext;
        let fileUrl = serverUrl + path.join("files", imageName)

        if (process.platform == "win32") { 
            fileUrl = fileUrl.replace("\\", "/");
        }

        const filePath = path.join(__dirname, "..", "files", imageName);
        const image = new ImageModel({ url: fileUrl});
        await image.save()
            .then((data) => {
                file[key].mv(filePath)
                sendVideoDetailToQueue(data);
                return res.status(201).json({ status: "success", data: data.toJSON() });
            })
            .catch((err) => {
                return res.status(500).json({ "error": err });
            });
    });
}


const deleteVideoById = async(req, res) => {
    const videoId = req.params.id;

    await ImageModel.findById(videoId)
        .then(async (data) => {
            if (!data) {
                return res.status(404).json({ status: "error", message: `${videoId} not found` });
            }

            const urlSplit = data.url.split("/")
            const filePath = urlSplit[urlSplit.length - 1]

            fs.unlink(path.join(__dirname, "..", "files", filePath), (err) => {
                if (err) {
                    throw new Error("Could not delete video from file storage");
                }
            });
            await data.deleteOne()
            return res.status(200).json({ status: "success", message: `${videoId} deleted` })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ status: "error", message: err });
        });
    // return res.status(200).json({ message: "success", data: [] });
}


module.exports = {
    getVideoFile,
    getAllVideos,
    getVideoById,
    uploadVideo,
    deleteVideoById,
}
