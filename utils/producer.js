'use strict';

const redisConfig = require("../config");

const { Message, Producer, QueueManager } = require('redis-smq');


function sendVideoDetailToQueue(data) {
    const producer = new Producer(redisConfig);
    producer.run((err) => {
       if (err) throw err;
       const message = new Message();
       message
            .setBody(data)
            .setTTL(3600000) // message expiration (in millis)
            .setQueue('video_transcribe'); // setting up a direct exchange 

       producer.produce(message, (err) => {
          if (err) console.log(err);
          else {
             const msgId = message.getId(); // string
             console.log('Successfully produced. Message ID is ', msgId);
          }
       });
    })
}

module.exports = sendVideoDetailToQueue;
