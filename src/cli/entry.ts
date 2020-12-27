import {CLIOptions, CLIRules, SourceFile} from '@types';
import {debugLn, errorLn, warnLn} from '@utils/log';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import {handler} from './handler';

// Entry point
/* eslint-disable no-console */
export const entry = async (sources: string[], cmd: CLIOptions): Promise<void> => {
    const cwd = process.cwd();
    const {rules} = cmd;

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

            // Try to read and parse the locale file
            try {
                const source = fs.readFileSync(filePath, 'utf-8');
                files.push({
                    content: JSON.parse(source),
                    source, name, filePath
                });
            } catch (e) {
                errorLn(`Couldn't read / parse file: ${filePath}`);

                // Exit in case invalid files shouldn't be skipped
                !cmd.skipInvalid && process.exit(-2);

                // Print error message during debug mode
                cmd.debug && console.error(e);
                continue;
            }

            cmd.debug && debugLn(`Loaded ${path.basename(filePath)} (${filePath})`);
        }
    }

    // Nothing to process
    if (!files.length) {
        cmd.debug && debugLn('Nothing to process.');
        return;
    }

    // Process files
    let errored = false;
    for (const [flag, func] of handler) {
        const rule = rules[flag as keyof CLIRules];

        cmd.debug && debugLn(`Rule "${flag}": ${rule?.[0] || 'off'}`);
        if (rule && rule[0] !== 'off') {

            // We need to check against false as undefined is falsy
            const ok = func({files, cmd, rule});
            errored = (rule[0] === 'warn' && !ok) || errored;
        }
    }

    const exitCode = errored ? -1 : 0;
    cmd.debug && debugLn(`Exiting with error: ${errored} (code: ${exitCode})`);
    process.exit(exitCode);
};
