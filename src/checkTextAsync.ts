import { checkText, Result } from 'yandex-speller';
import { isNil } from 'lodash';

export default async function checkTextAsync(text: string): Promise<Array<Result>> {
    return new Promise<Array<Result>>((resolve, reject) => checkText(text, (error, body) => {
        if (!isNil(error)) {
            reject(error);
        }

        resolve(body);
    }));
}
