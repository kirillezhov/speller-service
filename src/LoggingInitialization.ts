import { configure } from 'log4js';
import fs from 'fs';

const logDirectory = 'dist/logs';

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

configure({
    appenders: {
        file: { type: 'fileSync', layout: { type: 'basic' }, filename: `${logDirectory}/speller.log` },
        console: { type: 'console' },
    },
    categories: { default: { appenders: ['file', 'console'], level: 'debug' } },
});
