const express = require("express");

const requestEndpoint = require("./middleware/utils");
const { getAllImages, getImageById, uploadImage } = require("./controller/image");

const app = express();
const router = express.Router();

router.get("/", getAllImages);
router.get("/:id", getImageById);
router.post("/", uploadImage);

app.use(requestEndpoint);
app.use("/images", router);

module.exports = app
