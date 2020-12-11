import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from 'express';
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
} from 'lodash';
import { checkText } from 'yandex-speller';

const DEFAULT_ENCODING = 'utf-8';
const MULTIPART_FIELD_NAME = 'textFile';
const supportedMimeTypes = ['text/plain'];

export default class SpellerService {
    private readonly app = express();

    private readonly textDecoder = new TextDecoder(DEFAULT_ENCODING);

    private readonly logger = getLogger('speller');

    private readonly multerUploadMiddleware = this.generateMulterUploadMiddleware(
        multer().single(MULTIPART_FIELD_NAME),
    );

    constructor() {
        this.app.post('/check', this.multerUploadMiddleware, this.handleCheckPost);
    }

    async checkTextAsync(text: string): Promise<string> {
        return new Promise<string>((resolve, reject) => checkText(text, (error, body) => {
            let resultText = text;

            if (!isNil(error)) {
                reject(error);
            }

            forEach(body, (result) => {
                const { word, s } = result;
                const priorityString = head(s);

                if (isNil(priorityString)) {
                    return;
                }

                resultText = replace(resultText, word, priorityString);
            });

            resolve(resultText);
        }));
    }

    private generateMulterUploadMiddleware(multerUploadFunction: RequestHandler): RequestHandler {
        return (request: Request, response: Response, next: NextFunction) => multerUploadFunction(
            request,
            response,
            // @ts-expect-error
            (error: Error) => {
                if (!isNil(error)) {
                    this.logger.error(error);

                    return response
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .send(error.message);
                }

                return next();
            },
        );
    }

    private handleCheckPost = async (request: Request, response: Response): Promise<Response> => {
        if (!includes(supportedMimeTypes, request.file.mimetype)) {
            return response
                .status(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
                .send(ReasonPhrases.UNSUPPORTED_MEDIA_TYPE);
        }

        try {
            const sourceText = this.textDecoder.decode(request.file.buffer);
            const resultText = await this.checkTextAsync(sourceText);

            this.logger.debug('Result: ', resultText);

            return response.sendStatus(StatusCodes.OK);
        } catch (error) {
            this.logger.error(error);

            return response
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(error.message);
        }
    }

    run(port: number, address: string): http.Server {
        return this.app.listen(port, address, () => this.logger.info(`speller-service running at: http://${address}:${port}`));
    }
}
