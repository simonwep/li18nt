/* eslint-disable no-console */
import {duplicates, sort} from '../app';
import {JSONObject} from '@types';
import {debug, error, info, success, warn} from './log';
import {Command, program} from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import {prettyPropertyPath} from './prettyPropertyPath';

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
}

// Entrypoint
function run(files: string[], cmd: Command) {
    const cwd = process.cwd();

    // Resolve paths
    const objects: SourceFile[] = [];

    for (const file of files) {
        const filePath = path.resolve(cwd, file);
        const name = path.basename(filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            warn(`File not found: ${filePath}`);
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
            error(`Couldn't read / parse file: ${filePath}`);
            continue;
        }

        cmd.debug && debug(`Loaded ${path.basename(filePath)} (${filePath})`);
    }

    if (!objects.length) {
        return;
    }

    if (cmd.duplicates) {
        const dupes = duplicates(objects[0].content);

        if (dupes.size) {
            info(`Found ${dupes.size === 1 ? 'one duplicate' : `${dupes.size} duplicates`}:`);

            let i = 1;
            for (const [key, paths] of dupes.entries()) {
                process.stdout.write(` ${i}. '${key}': `);

                if (paths.length > 1) {
                    process.stdout.write('\n');

                    for (const path of paths) {
                        console.log(`   + ${prettyPropertyPath(['[root]', ...path])}`);
                    }
                } else if (paths.length) {
                    console.log(prettyPropertyPath(['[root]', ...paths[0]]));
                }

                i++;
            }
        } else {
            success('No duplicates found!');
        }
    }

    // Write files
    if (cmd.pretty) {
        const indent = 4;
        for (const {content, name, filePath} of objects) {
            const str = sort(content, indent);
            fs.writeFileSync(filePath, str);
            cmd.debug && debug(`Prettified ${name} (${filePath})`);
        }
    }
}
