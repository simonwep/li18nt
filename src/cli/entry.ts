import {prettify} from '@tools/prettify';
import {CLIModule, CLIOptions, SourceFile} from '@types';
import {debugLn, errorLn, successLn, warnLn} from '@utils/log';
import {Command} from 'commander';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import {conflictsFlag} from './flags/conflicts.flag';
import {duplicatesFlag} from './flags/duplicates.flag';

const flags: Partial<Record<keyof CLIOptions, CLIModule>> = {
    'conflicts': conflictsFlag,
    'duplicates': duplicatesFlag
};

// Entry point
/* eslint-disable no-console */
export const entry = (sources: string[], cmd: Command & CLIOptions): void => {
    const cwd = process.cwd();

    // Resolve files
    const files: SourceFile[] = [];
    for (const source of sources) {
        for (const file of glob.sync(source)) {
            const filePath = path.resolve(cwd, file);
            const name = path.basename(filePath);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                warnLn(`File not found: ${filePath}`);
                continue;
            }

            // Try to read an parse
            try {
                const source = fs.readFileSync(filePath, 'utf-8');
                files.push({
                    content: JSON.parse(source),
                    source, name, filePath
                });
            } catch (e) {
                errorLn(`Couldn't read / parse file: ${filePath}`);
                cmd.debug && console.error(e);
                process.exit(-2);
                continue;
            }

            cmd.debug && debugLn(`Loaded ${path.basename(filePath)} (${filePath})`);
        }
    }

    // Nothing to process
    if (!files.length) {
        return;
    }

    // Process files
    let errored = false;
    for (const [flag, handler] of Object.entries(flags)) {
        if (cmd[flag] && handler) {

            // We need to check against false as undefined is falsy
            errored = handler({files, cmd}) === false || errored;
        }
    }

    // Prettify?
    if (cmd.prettify) {
        const test = !!cmd.test;

        for (const {content, source, name, filePath} of files) {
            const str = `${prettify(content, cmd.prettify)}\n`;

            if (str !== source) {
                if (test) {
                    errorLn(`Unformatted: ${name}`);
                    errored = true;
                } else {
                    fs.writeFileSync(filePath, str);
                    successLn(`Prettified: ${name}`);
                }
            } else if (!cmd.quiet && test) {
                successLn(`Validated: ${name}`);
            }
        }
    }

    const exitCode = errored ? -1 : 0;
    cmd.debug && debugLn(`Exiting with error: ${errored} (code: ${exitCode})`);
    process.exit(exitCode);
};
