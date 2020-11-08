/* eslint-disable no-console */
import chalk from 'chalk';
import {difference, duplicates, sort} from '../app';
import {JSONObject} from '@types';
import {debugLn, errorLn, infoLn, successLn, warn, warnLn} from './log';
import {prettyPropertyPath} from './prettyPropertyPath';
import {Command, program} from 'commander';
import * as path from 'path';
import * as fs from 'fs';

program.version(typeof VERSION === 'undefined' ? 'unknown' : VERSION)
    .arguments('[files...]')
    .option('--debug', 'Debug information')
    .option('-p, --pretty', 'Prettify files')
    .option('-d, --duplicates', 'Find duplicates')
    .option('-e, --diff', 'Find differences and conflicts')
    .description('Lint i18n locales files', {
        files: 'Files to lint'
    })
    .action(run)
    .parse(program.args);

type SourceFile = {
    content: JSONObject;
    name: string;
    filePath: string;
};

// Entrypoint
function run(files: string[], cmd: Command) {
    const cwd = process.cwd();

    // Resolve files
    const objects: SourceFile[] = [];
    for (const file of files) {
        const filePath = path.resolve(cwd, file);
        const name = path.basename(filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            warnLn(`File not found: ${filePath}`);
            continue;
        }

        // Try to read an parse
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            objects.push({
                content: JSON.parse(content),
                name, filePath
            });
        } catch (e) {
            errorLn(`Couldn't read / parse file: ${filePath}`);
            continue;
        }

        cmd.debug && debugLn(`Loaded ${path.basename(filePath)} (${filePath})`);
    }

    // Nothing to process
    if (!objects.length) {
        return;
    }

    // Find differences
    if (cmd.diff) {
        const diff = difference(objects.map(v => v.content));
        let count = 0;

        for (let i = 0; i < diff.length; i++) {
            const {conflicts, missing} = diff[i];
            const {name} = objects[i];

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
    }

    // Find duplicates
    if (cmd.duplicates) {
        let count = 0;

        for (const {name, content} of objects) {
            const dupes = duplicates(content);

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
                        console.log(prettyPropertyPath(paths[0]));
                    }
                }

                count++;
            }
        }

        !count && successLn('No duplicates found!');
    }

    // Prettify?
    if (cmd.pretty) {
        const indent = 4;
        for (const {content, name, filePath} of objects) {
            const str = sort(content, indent);
            fs.writeFileSync(filePath, str);
            cmd.debug && debugLn(`Prettified ${name} (${filePath})`);
        }
    }
}
