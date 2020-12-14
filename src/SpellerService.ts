import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from 'express';
import detectCharacterEncoding from 'detect-character-encoding';
import http from 'http';
import multer from 'multer';
import { getLogger } from 'log4js';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import {
    forEach,
    head,
    includes,
    isNil,
    replace,
    toLower,
} from 'lodash';
import { Result, Settings } from 'yandex-speller';

import checkTextAsync from './checkTextAsync';

export default class SpellerService {
    static readonly defaultEncoding = 'utf-8';

    static readonly multiPartFieldName = 'textFile';

    static readonly supportedMimeTypes = ['text/plain'];

    private readonly app = express();

    private readonly textDecoder = new TextDecoder(SpellerService.defaultEncoding);

    private readonly textEncoder = new TextEncoder();

    private readonly logger = getLogger('speller');

    private readonly settings: Settings = {
        timeout: 3000,
    }

    private readonly multerUploadMiddleware = this.generateMulterUploadMiddleware(
        multer().single(SpellerService.multiPartFieldName),
    );

    constructor() {
        this.app.post('/check', this.multerUploadMiddleware, this.handleCheck);
    }

    private generateMulterUploadMiddleware(multerUploadFunction: RequestHandler): RequestHandler {
        return (request: Request, response: Response, next: NextFunction) => multerUploadFunction(
            request,
            response,
            // @ts-expect-error
            (error: Error) => {
                if (!isNil(error)) {
                    this.logger.error('Endpoint: /check, File upload error: ', error);

                    return response
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .send(error.message);
                }

                return next();
            },
        );
    }

    private fixTypos(typos: ReadonlyArray<Result>, sourceText: Readonly<string>): string {
        let resultText = sourceText;

        forEach(typos, (result) => {
            const { word, s } = result;
            const mostRelevantCorrectWord = head(s);

            if (isNil(mostRelevantCorrectWord)) {
                this.logger.error(`Correction not found for word [${word}]`);

                return;
            }

            // NOTE(KE): can be improved with StringBuilder (https://www.npmjs.com/package/string-builder) instead of replace() if needed
            resultText = replace(resultText, word, mostRelevantCorrectWord);
        });

        return resultText;
    }

    private handleCheck = async (request: Request, response: Response): Promise<Response> => {
        if (!includes(SpellerService.supportedMimeTypes, request.file.mimetype)) {
            return response
                .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
                .send(ReasonPhrases.UNSUPPORTED_MEDIA_TYPE);
        }

        if (request.file.size === 0) {
            return response
                .status(StatusCodes.BAD_REQUEST)
                .send('File content is empty');
        }

        const resultDetect = detectCharacterEncoding(request.file.buffer);

        if (isNil(resultDetect)) {
            return response
                .status(StatusCodes.BAD_REQUEST)
                .send('File encoding not detected');
        }

        const { encoding } = resultDetect;

        if (toLower(encoding) !== SpellerService.defaultEncoding) {
            return response
                .status(StatusCodes.BAD_REQUEST)
                .send(`Unsupported encoding: ${encoding}`);
        }

        let sourceText: string | undefined;

        try {
            sourceText = this.textDecoder.decode(request.file.buffer);

            const typos = await checkTextAsync(sourceText, this.settings);
            const resultText = this.fixTypos(typos, sourceText);
            const responseBuffer = Buffer.from(this.textEncoder.encode(resultText));

            response.contentType(request.file.mimetype);

            return response
                .status(StatusCodes.OK)
                .send(responseBuffer);
        } catch (error) {
            this.logger.error(`Endpoint: /check, Source text: ${sourceText}, Error: `, error);

            return response
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(error.message);
        }
    }

    run(port: number, address: string): http.Server {
        return this.app.listen(port, address, () => this.logger.info(`speller-service running at: http://${address}:${port}`));
    }
}
