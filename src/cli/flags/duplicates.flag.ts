import {duplicates} from '@tools/duplicates';
import {CLIModule, CLIOptions} from '@types';
import {infoLn, successLn} from '@utils/log';
import {prettyPropertyPath} from '@utils/prettyPropertyPath';
import chalk from 'chalk';

/* eslint-disable no-console */
export const duplicatesFlag: CLIModule = ({files, cmd}) => {
    let config: Partial<CLIOptions['duplicates']> = {mode: 'loose'};
    const options = cmd.duplicates;

    if (typeof options === 'string') {
        config = {mode: options};
    } else if (typeof options === 'object' && options !== null) {
        config = options;
    }

    let count = 0;
    for (const {name, content} of files) {
        const dupes = duplicates(content, config);

        if (dupes.size) {
            infoLn(`${chalk.blueBright(`${name}:`)} Found ${dupes.size === 1 ? 'one duplicate' : `${dupes.size} duplicates`}:`);

            for (const [key, paths] of dupes.entries()) {
                process.stdout.write(`    ${chalk.cyanBright(key)} (${paths.length}x): `);

                if (paths.length > 1) {
                    process.stdout.write('\n');

                    for (const path of paths) {
                        console.log(`        ${prettyPropertyPath(path, chalk.cyanBright)}`);
                    }
                } else if (paths.length) {
                    console.log(prettyPropertyPath(paths[0], chalk.cyanBright));
                }
            }

            count++;
        }
    }

    !count && !cmd.quiet && successLn('No duplicates found!');
    return config.mode === 'loose' || !count;
};
