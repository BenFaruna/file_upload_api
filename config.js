'use strict';

module.exports = {
    namespace: 'file_upload_api',
    redis: {
        client: 'redis_v4',
        options: {
            url: process.env.REDIS_URL,
            connect_timeout: 3600000,
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