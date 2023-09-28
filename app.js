const express = require("express");
const fileUpload = require("express-fileupload");

const requestEndpoint = require("./middleware/utils");
const { getAllImages, getImageById, uploadImage, deleteImageById } = require("./controller/video");
const { filesPayloadExists } = require("./middleware/file_upload");

const app = express();
const router = express.Router();

router.get("/", getAllImages);
router.get("/:id", getImageById);
router.post("/",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  uploadImage
);
router.delete("/:id", deleteImageById);

app.use(requestEndpoint);
app.use("/videos", router);

module.exports = app
