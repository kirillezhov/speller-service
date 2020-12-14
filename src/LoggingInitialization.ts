import { configure } from 'log4js';
import fs from 'fs';

const logDirectory = 'dist/logs';

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

configure({
    appenders: {
        console: { type: 'console' },
    },
    categories: { default: { appenders: ['console'], level: 'debug' } },
});
