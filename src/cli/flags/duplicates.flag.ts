import {duplicates} from '@tools/duplicates';
import {CLIModule, CLIOptions} from '@types';
import {getLoggingSet, successLn} from '@utils/log';
import {makeList} from '@utils/makeList';
import {pluralize} from '@utils/pluralize';
import {prettyPropertyPath} from '@utils/prettyPropertyPath';
import chalk from 'chalk';

/* eslint-disable no-console */
export const duplicatesFlag: CLIModule = ({files, cmd}) => {
    let config: Partial<CLIOptions['duplicates']> = {mode: 'warn'};
    const options = cmd.duplicates;

    if (typeof options === 'string') {
        config = {mode: options};
    } else if (typeof options === 'object' && options !== null) {
        config = options;
    }

    const {logLn, accent} = getLoggingSet(config.mode as string);

    let count = 0;
    for (const {name, content} of files) {
        const dupes = duplicates(content, config);

        if (dupes.size) {
            logLn(`${accent(`${name}:`)} Found ${pluralize('duplicate', dupes.size)}:`);

            for (const [initial, ...duplicates] of dupes.values()) {
                process.stdout.write(`    ${prettyPropertyPath(initial, chalk.cyanBright)} (${duplicates.length}x): `);

                if (duplicates.length > 1) {
                    process.stdout.write('\n');

                    for (const [num, path] of makeList(duplicates)) {
                        console.log(`       ${num}. ${prettyPropertyPath(path, accent)}`);
                    }
                } else if (duplicates.length) {
                    console.log(prettyPropertyPath(duplicates[0], accent));
                }
            }

            count++;
        }
    }

    !count && !cmd.quiet && successLn('No duplicates found!');
    return config.mode === 'warn' || !count;
};
