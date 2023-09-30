const amqp = require("amqplib");


async function sendVideoDetailToQueue(data) {
  const queue = "video_transcribe";
  let connection;
  try {
    const rabbitUrl = process.env.RABBIT_URL || "amqp://localhost"
    connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    console.log(" [x] Sent '%s'", data);
    await channel.close();
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = sendVideoDetailToQueue;
