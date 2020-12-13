declare module 'yandex-speller' {
    export interface Options {
        /**
         * Ignore words written in capital letters
         */
        ignoreUppercase: boolean;

        /**
         * Ignore words with numbers, such as "avp17h4534"
         */
        ignoreDigits: boolean;

        /**
         * Ignore Internet addresses, email addresses and filenames
         */
        ignoreUrls: boolean;

        /**
         * Highlight repetitions of words, consecutive. For example, "I flew to to to Cyprus"
         */
        findRepeatWords: boolean;

        /**
         * Ignore words, written in Latin, for example, "madrid"
         */
        ignoreLatin: boolean;

        /**
         * Just check the text, without giving options to replace
         */
        noSuggest: boolean;

        /**
         * Celebrate words, written in Latin, as erroneous
         */
        flagLatin: boolean;

        /**
         * Do not use a dictionary environment (context) during the scan.
         * This is useful in cases where the service is transmitted to the input
         * of a list of individual words
         */
        byWords: boolean;

        /**
         * Ignore the incorrect use of UPPERCASE / lowercase letters,
         * for example, in the word "moscow"
         */
        ignoreCapitalization: boolean;

        /**
         * Ignore Roman numerals ("I, II, III, ...")
         */
        ignoreRomanNumerals: boolean;
    }

    export interface Settings {
        /**
         * Text format: plain or html
         */
        format: 'plain' | 'html';

        /**
         * Language: en, ru or uk
         */
        lang: string | Array<string>;

        /**
         * Request repeat count in case internet connection issues
         */
        requestLimit: number;

        /**
         * Timeout between request repeats in milliseconds
         */
        timeout: number;

        options: Options;
    }

    export interface Result {
        code: number;

        pos: number;

        row: number;

        col: number;

        len: number;

        word: string;

        s: Array<string>;
    }

    /**
     * Check text for typos
     * @param text
     * @param callback
     * @param settings
     */
    export function checkText(
        text: string,
        callback: (error: Error | null, body: Array<Result>) => void,
        settings?: Settings,
    ): void;
}
