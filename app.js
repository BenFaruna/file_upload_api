const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const requestEndpoint = require("./middleware/utils");
const { getAllVideos, getVideoById, getVideoFile, uploadVideo, deleteVideoById } = require("./controller/video");
const { filesPayloadExists, fileExtLimiter } = require("./middleware/file_upload");

const app = express();
const router = express.Router();

// app.use(express.static("files"))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.post("/",
  fileUpload({
    createParentPath: true,
    useTempFiles : true,
    tempFileDir : "/tmp/",
    debug: process.env.DEBUG || false,
  }),
  filesPayloadExists,
  fileExtLimiter([".mp4", ".webm", ".gif", ".avi", ".mkv"]),
  uploadVideo
);
router.delete("/:id", deleteVideoById);

app.use(requestEndpoint);
app.use("/videos", router);
app.get("/files/:path", getVideoFile)

module.exports = app
