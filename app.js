/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
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
 *   name: Video
 *   description: the video manageing API
 * /api/videos:
 *    get:
 *      summary: Lists all the videos
 *      tags: [Video]
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
 *                        type:
 *                          $ref: '#/components/schemas/Video'
 *    post:
 *      summary: Uploads a videos
 *      tags: [Video]
 *      requestBody:
 *        required: true
 *        content:
 *          video/*:
 *            parameters:
 *              - in: formData
 *                name: upFile
 *                type: file
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
 *                  $ref: '#/components/schemas/Video'
 * /api/videos/{id}:
 *   get:
 *     summary: lists details of specific video
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: the video id
 *     responses:
 *       200:
 *         description: the details of a specific video
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#components/schemas/Video'
 *       404:
 *         description: the video was not found
 *   delete:
 *     summary: deletes video details
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: truez
 *         description: the video id
 *     responses:
 *       200:
 *         description: video deleted succesfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: the video was not found
 *       500:
 *         description: the server had issues deleting the server file
 *      
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
