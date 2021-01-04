import {CLIOptions} from '@types';
import {Command} from 'commander';
import fs from 'fs';
import path from 'path';
import {debugLn, error} from './log';

const configFileNames = [
    '.li18ntrc',
    '.li18nt.json',
    '.li18ntrc.json',
    'li18nt.config.js'
];

const CAN_REQUIRE = /(\.json|\.js)$/;
const load = (filePath: string) => {
    if (CAN_REQUIRE.exec(filePath)) {
        return require(filePath);
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

/**
 * Tries to find a configuration ile and parses it
 * @param cmd
 */
export const resolveConfiguration = (cmd: Command & CLIOptions): CLIOptions | null => {
    const cwd = process.cwd();

    // User specified a file-path
    if (typeof cmd.config === 'string') {
        const filePath = path.resolve(cwd, cmd.config);

        if (!fs.existsSync(filePath)) {
            error(`Couldn't find ${filePath}.`);
            process.exit(1);
        }

        try {
            return load(filePath);
        } catch (err) {
            error(`Couldn't import ${filePath}.`);
            cmd.debug && debugLn(err);
            process.exit(1);
        }
    }

    // Try finding a config file
    for (const fileName of configFileNames) {
        const filePath = path.resolve(cwd, fileName);

        if (fs.existsSync(filePath)) {
            cmd.debug && debugLn(`Found config: ${filePath}`);

            try {
                return load(filePath);
            } catch (err) {
                error(`Couldn't load ${filePath}.`);
                cmd.debug && debugLn(err);
                process.exit(1);
            }
        }
    }

    return null;
};
