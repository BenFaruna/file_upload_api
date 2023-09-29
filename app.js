const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const requestEndpoint = require("./middleware/utils");
const { getAllImages, getImageById, uploadImage, deleteImageById } = require("./controller/video");
const { filesPayloadExists, fileExtLimiter } = require("./middleware/file_upload");

const app = express();
const router = express.Router();

// app.use(express.static("files"))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

router.get("/", getAllImages);
router.get("/:id", getImageById);
router.post("/",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".mp4", ".webm", ".gif", ".avi", ".mkv"]),
  uploadImage
);
router.delete("/:id", deleteImageById);

app.use(requestEndpoint);
app.use("/videos", router);

module.exports = app
