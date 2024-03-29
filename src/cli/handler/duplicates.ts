import {duplicates, DuplicatesConfig} from '@lib';
import {CLIModule} from '@types';
import chalk from 'chalk';
import {generateList} from '@shared';
import {getLoggingSet, successLn} from '../utils/log';
import {pluralize} from '../utils/pluralize';
import {prettyPropertyPath} from '../utils/prettyPropertyPath';

/* eslint-disable no-console */
export const duplicatesHandler: CLIModule<DuplicatesConfig> = ({files, cmd, rule}) => {
    const [mode, options] = rule;
    const {logLn, accent} = getLoggingSet(mode);

    let errors = 0;
    for (const {name, content} of files) {
        const dupes = duplicates(content, options);

        if (dupes.size) {
            logLn(`${accent(`${name}:`)} Found ${pluralize('duplicate', dupes.size)}:`);

            for (const [initial, ...duplicates] of dupes.values()) {
                process.stdout.write(`    ${prettyPropertyPath(initial, chalk.cyanBright)} (${duplicates.length}x): `);

                if (duplicates.length > 1) {
                    process.stdout.write('\n');

                    for (const [num, path] of generateList(duplicates)) {
                        console.log(`       ${num}. ${prettyPropertyPath(path, accent)}`);
                    }
                } else if (duplicates.length) {
                    console.log(prettyPropertyPath(duplicates[0], accent));
                }
            }

            errors++;
        }
    }

    !errors && !cmd.quiet && successLn('No duplicates found!');
    return !errors;
};
