'use strict';

require("dotenv").config();

const path = require("path");
const redisConfig = require("../config");
const VideoModel = require("../model/video");
const transcribeLocalVideo = require("./video_transcribe");

const { Consumer } = require('redis-smq');

const consumer = new Consumer(redisConfig);

async function addTranscriptionToDB(jsonData) {
   const fileId = jsonData._id;
   const urlSplit = jsonData.url.split("/");
   let filePath = urlSplit[urlSplit.length - 1];
   filePath = path.join(__dirname, "..", "files", filePath);
 
   await VideoModel.findById(fileId)
     .then(async (data) => {
       if (!data) {
         throw new Error(`${fileId} not found`)
       }
       const response = await transcribeLocalVideo(filePath)
       if (!response) {
         throw new Error("Transcription Failed!");
       }
       // console.dir(response, {depth: null})
       const transcript = response.channels[0].alternatives[0].transcript;
       const words = response.channels[0].alternatives[0].words;
 
       await data.updateOne({
         $set: { words, transcript }
       });
       console.log(data.id, "Updated!")
     })
     .catch((err) => {
       console.log(err);
     });
 }

const messageHandler = async (msg, cb) => {
   const payload = msg.getBody();
   console.log('Message payload', payload);

   addTranscriptionToDB(payload)
    .then((data) => {
      console.log("Data transcription complete", data);
      cb(null, true); // acknowledging the message
    })
    .catch((err) => {
      cb(err, false);
    });
};

consumer.consume('video_transcribe', messageHandler, (err) => {
   if (err) console.error(err);
});

consumer.run();