import {prettify, PrettifyOptions} from '@tools/prettify';
import {CLIModule} from '@types';
import {errorLn, successLn, warnLn} from '@utils/log';
import fs from 'fs';

/* eslint-disable no-console */
export const prettifyHandler: CLIModule<PrettifyOptions> = ({files, cmd, rule}) => {
    const [mode, options = {indent: 4}] = rule;

    let errors = 0;
    for (const {content, source, name, filePath} of files) {
        const str = `${prettify(content, options)}\n`;

        if (str !== source) {
            if (cmd.fix) {
                fs.writeFileSync(filePath, str);
                successLn(`Prettified: ${name}`);
            } else if (mode === 'warn') {
                warnLn(`Unformatted: ${name}`);
            } else {
                errorLn(`Unformatted: ${name}`);
                errors++;
            }
        } else if (!cmd.quiet && cmd.fix) {
            successLn(`Already formatted: ${name}`);
        }
    }

    !errors && !cmd.quiet && successLn('Everything prettified!');
    return !errors;
};
