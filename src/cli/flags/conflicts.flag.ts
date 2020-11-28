import {conflicts} from '@tools/conflicts';
import {CLIModule} from '@types';
import {error, successLn, warn} from '@utils/log';
import {makeList} from '@utils/makeList';
import {prettyPropertyPath} from '@utils/prettyPropertyPath';
import chalk from 'chalk';

/* eslint-disable no-console */
export const conflictsFlag: CLIModule = ({files, cmd}) => {
    const diff = conflicts(files.map(v => v.content));
    const strict = (cmd.conflicts || 'error') === 'error';
    let count = 0;

    for (let i = 0; i < diff.length; i++) {
        const {conflicts, missing} = diff[i];
        const {name} = files[i];

        if (conflicts.length) {
            warn(`${chalk.yellowBright(`${name}:`)} Found ${conflicts.length === 1 ? 'one conflict' : `${conflicts.length} conflicts`}:`);

            if (conflicts.length > 1) {
                console.log();

                for (const [num, path] of makeList(conflicts)) {
                    console.log(`    ${num}. ${prettyPropertyPath(path, chalk.yellowBright)}`);
                }
            } else {
                console.log(` ${prettyPropertyPath(conflicts[0], chalk.yellowBright)}`);
            }
        }

        if (missing.length) {
            error(`${chalk.redBright(`${name}:`)} Found ${missing.length === 1 ? 'one missing value' : `${missing.length} missing values`}:`);

            if (missing.length > 1) {
                console.log();

                for (const [num, path] of makeList(missing)) {
                    console.log(`    ${num}. ${prettyPropertyPath(path, chalk.redBright)}`);
                }
            } else {
                console.log(` ${prettyPropertyPath(missing[0], chalk.redBright)}`);
            }
        }

        count += conflicts.length + missing.length;
    }

    !count && !cmd.quiet && successLn('No conflicts found!');
    return !strict || !count;
};
