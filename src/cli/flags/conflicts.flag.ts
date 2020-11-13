import {conflicts} from '@tools/conflicts';
import {CLIModule} from '@types';
import {error, successLn, warn} from '@utils/log';
import {prettyPropertyPath} from '@utils/prettyPropertyPath';
import chalk from 'chalk';

/* eslint-disable no-console */
export const conflictsFlag: CLIModule = ({files, cmd}) => {
    const diff = conflicts(files.map(v => v.content));
    const strict = (cmd.conflicts || 'strict') === 'strict';
    let count = 0;

    for (let i = 0; i < diff.length; i++) {
        const {conflicts, missing} = diff[i];
        const {name} = files[i];

        if (conflicts.length) {
            warn(`${chalk.yellowBright(`${name}:`)} Found ${conflicts.length === 1 ? 'one conflict' : `${conflicts.length} conflicts`}:`);

            if (conflicts.length > 1) {
                console.log();

                for (const path of conflicts) {
                    console.log(`    ${prettyPropertyPath(path, chalk.yellowBright)}`);
                }
            } else if (conflicts.length) {
                console.log(` ${prettyPropertyPath(conflicts[0])}`);
            }
        }

        if (missing.length) {
            error(`${chalk.redBright(`${name}:`)} Found ${missing.length === 1 ? 'one missing value' : `${missing.length} missing values`}:`);

            if (missing.length > 1) {
                console.log();

                for (const path of missing) {
                    console.log(`    ${prettyPropertyPath(path, chalk.redBright)}`);
                }
            } else if (missing.length) {
                console.log(` ${prettyPropertyPath(missing[0], chalk.cyanBright)}`);
            }
        }

        count += conflicts.length + missing.length;
    }

    !count && !cmd.quiet && successLn('No conflicts found!');
    return !strict || !count;
};
