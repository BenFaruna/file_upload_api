const fs = require('fs')
const { execSync: exec } = require('child_process')
const { Deepgram } = require('@deepgram/sdk')
const ffmpegStatic = require('ffmpeg-static')
// const path = require("path")

require("dotenv").config()


const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

const deepgram = new Deepgram(DEEPGRAM_API_KEY)

async function ffmpeg(command) {
  return new Promise((resolve, reject) => {
    exec(`"${ffmpegStatic}" ${command}`, (err, stderr, stdout) => {
      if (err) reject(err)
      resolve(stdout)
    })
  })
}

async function transcribeLocalVideo(filePath) {
  await ffmpeg(`-hide_banner -y -i "${filePath}" "${filePath}.wav"`)

  const audioFile = {
    buffer: fs.readFileSync(`${filePath}.wav`),
    mimetype: 'audio/wav',
  }
  const response = await deepgram.transcription.preRecorded(audioFile, {
    punctuation: true,
  }).then(data => {
    fs.unlink(`${filePath}.wav`, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return data
  })
  .catch(err => console.log(err));
  return response.results
}


module.exports = transcribeLocalVideo;
