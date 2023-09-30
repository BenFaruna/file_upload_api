const amqp = require("amqplib");
const path = require("path")

const VideoModel = require("../model/video");
const transcribeLocalVideo = require("./video_transcribe");

const queue = "video_transcribe";


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


(async () => {
  try {
    const rabbitUrl = process.env.RABBIT_URL || "amqp://localhost"
    const receiverConnection = await amqp.connect(rabbitUrl);
    const receiverChannel = await receiverConnection.createChannel();

    process.once("SIGINT", async () => {
      await receiverChannel.close();
      await receiverConnection.close();
    });

    await receiverChannel.assertQueue(queue, { durable: false });
    await receiverChannel.consume(
      queue,
      async (message) => {
        if (message) {
          console.log(
            " [x] Received '%s'",
            JSON.parse(message.content.toString())
          );
          await addTranscriptionToDB(JSON.parse(message.content.toString()));
        }
      },
      { noAck: true }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.warn(err);
  }
})();
