import {difference} from '@tools/difference';
import {errorLn, successLn, warn} from '@utils/log';
import {prettyPropertyPath} from '@utils/prettyPropertyPath';
import {CLIModule} from '@types';
import chalk from 'chalk';

/* eslint-disable no-console */
export const differencesFlag: CLIModule = ({files, cmd}) => {
    const diff = difference(files.map(v => v.content));
    const strict = cmd.diff === 'strict';
    let count = 0;

    for (let i = 0; i < diff.length; i++) {
        const {conflicts, missing} = diff[i];
        const {name} = files[i];

        if (conflicts.length) {
            warn(`${chalk.yellowBright(`${name}:`)} Found ${conflicts.length === 1 ? 'one conflict' : `${conflicts.length} conflicts`}:`);

            if (conflicts.length > 1) {
                for (const path of conflicts) {
                    console.log(`    ${prettyPropertyPath(path, chalk.yellowBright)}`);
                }
            } else if (conflicts.length) {
                console.log(` ${prettyPropertyPath(conflicts[0])}`);
            }
        }

        if (missing.length) {
            errorLn(`${chalk.redBright(`${name}:`)} Found ${missing.length === 1 ? 'one missing value' : `${missing.length} missing values`}:`);

            if (missing.length > 1) {
                for (const path of missing) {
                    console.log(`    ${prettyPropertyPath(path, chalk.redBright)}`);
                }
            } else if (missing.length) {
                console.log(` ${prettyPropertyPath(missing[0])}`);
            }
        }

        count += conflicts.length + missing.length;
    }

    !count && successLn('No conflicts found!');
    return !strict || !count;
};
