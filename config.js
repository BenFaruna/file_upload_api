'use strict';

module.exports = {
    namespace: 'file_upload_api',
    redis: {
        client: 'redis_v4',
        options: {
            url: process.env.REDIS_URL,
            connect_timeout: 3600000,
            socket: {
                reconnectStrategy: retries => Math.min(retries * 50, 1000),
                keepAlive: true,
            },
        },
    },
    logger: {
        enabled: true,
        options: {
            level: 'info',
        },
    },
    messages: {
      store: false,
    },
};