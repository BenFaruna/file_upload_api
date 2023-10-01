/**
 * @swagger
 * components:
 *   schemas:
 *     VideoModel:
 *       type: object
 *       required:
 *         - url
 *       properties:
 *         id:
 *           type: string
 *           description: the auto generated id of a video
 *         url:
 *           type: string
 *           description: the url to the video on the server
 *         transcript:
 *           type: string
 *           description: the transcript of the video
 *         words:
 *           type: array
 *           description: the word and timestamp of the transcript
 */

/**
 * @swagger
 * tags:
 *   name: VideoModel
 *   description: the video manageing API
 * /api/videos:
 *    get:
 *      summary: Lists all the videos
 *      tags: [VideoModel]
 *      responses:
 *        200:
 *          description: The list of videos
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  message:
 *                    type: string
 *                  data:
 *                    type: array
 *                    items:
 *                      message:
 *                        type: string
 *                      data:
  *                       $ref: '#/components/schemas/VideoModel'
 *    post:
 *      summary: Uploads a videos
 *      tags: [VideoModel]
 *      requestBody:
 *        required: true
 *        content:
 *          video/*:
 *            schema:
 *              filename:
 *                type: file
 *                format: binary
 *      responses:
 *        200:
 *          description: The details of the uploaded video
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                items:
 *                  message:
 *                    type: string
 *                  $ref: '#/components/schemas/VideoModel'
 *
 * /api/videos/{id}:
 *    get:
 *      summary: Lists details of specific video
 *      tags: [VideoModel]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          decription: the video id
 *          content:
 *            application/json:
 *              schema:
 *                @ref: '#components/schemas/VideoModel'
 *      responses:
 *        200:
 *          description: Details of specific video
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                items:
 *                  $ref: '#/components/schemas/VideoModel'
 */

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

const requestEndpoint = require("./middleware/utils");
const { getAllVideos, getVideoById, getVideoFile, uploadVideo, deleteVideoById } = require("./controller/video");
const { filesPayloadExists, fileExtLimiter } = require("./middleware/file_upload");

const app = express();

// app.use(express.static("files"))
app.use(cors());

const router = express.Router();

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
app.use("/api/videos", router);
app.get("/files/:path", getVideoFile)

module.exports = app
