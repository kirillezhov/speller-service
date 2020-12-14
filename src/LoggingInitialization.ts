import { configure } from 'log4js';

configure({
    appenders: {
        console: { type: 'console' },
    },
    categories: { default: { appenders: ['console'], level: 'debug' } },
});
