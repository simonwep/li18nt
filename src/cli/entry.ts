import {CLIModule, CLIOptions, SourceFile} from '@types';
import {debugLn, errorLn, warnLn} from '@utils/log';
import {differencesFlag} from './flags/differences.flag';
import {duplicatesFlag} from './flags/duplicates.flag';
import {sort} from '@tools/sort';
import {Command} from 'commander';
import fs from 'fs';
import path from 'path';

const flags: CLIModule[] = [
    differencesFlag,
    duplicatesFlag
];

// Entry point
/* eslint-disable no-console */
export const entry = (sources: string[], cmd: Command & CLIOptions): void => {
    const cwd = process.cwd();

    // Resolve files
    const files: SourceFile[] = [];
    for (const file of sources) {
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
            files.push({
                content: JSON.parse(content),
                name, filePath
            });
        } catch (e) {
            errorLn(`Couldn't read / parse file: ${filePath}`);
            cmd.debug && console.error(e);
            process.exit(-2);
            continue;
        }

        cmd.debug && debugLn(`Loaded ${path.basename(filePath)} (${filePath})`);
    }

    // Nothing to process
    if (!files.length) {
        return;
    }

    // Process files
    let errored = false;
    for (const handler of flags) {
        errored = handler({files, cmd}) === false || errored;
    }

    // Prettify?
    if (cmd.prettify) {
        const indent = 4;
        for (const {content, name, filePath} of files) {
            const str = sort(content, indent);
            fs.writeFileSync(filePath, str);
            cmd.debug && debugLn(`Prettified ${name} (${filePath})`);
        }
    }

    process.exit(errored ? -1 : 0);
};
