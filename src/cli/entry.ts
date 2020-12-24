import {prettify} from '@tools/prettify';
import {CLIModule, CLIOptions, CLIRules, SourceFile} from '@types';
import {debugLn, errorLn, successLn, warnLn} from '@utils/log';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import {conflictsFlag} from './flags/conflicts.flag';
import {duplicatesFlag} from './flags/duplicates.flag';
import {namingFlag} from './flags/naming.flag';

/* eslint-disable @typescript-eslint/no-explicit-any */
const flags: Partial<Record<keyof CLIRules, CLIModule<any>>> = {
    'conflicts': conflictsFlag,
    'duplicates': duplicatesFlag,
    'naming': namingFlag
};

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
                !cmd.skipInvalid && process.exit(-2);
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
        const rule = rules[flag as keyof CLIRules];

        cmd.debug && debugLn(`Rule "${flag}": ${rule?.[0] || 'off'}`);
        if (rule && rule[0] !== 'off' && handler) {

            // We need to check against false as undefined is falsy
            errored = handler({files, cmd, rule}) === false || errored;
        }
    }

    // Prettify?
    if (rules.prettified) {
        const [mode, options = {indent: 4}] = rules.prettified;

        if (mode !== 'off') {
            for (const {content, source, name, filePath} of files) {
                const str = `${prettify(content, options)}\n`;

                if (str !== source) {
                    if (cmd.fix) {
                        fs.writeFileSync(filePath, str);
                        successLn(`Prettified: ${name}`);
                    } else if (mode === 'warn') {
                        warnLn(`Unformatted: ${name}`);
                    } else {
                        errorLn(`Unformatted: ${name}`);
                        errored = true;
                    }
                } else if (!cmd.quiet && cmd.fix) {
                    successLn(`Validated: ${name}`);
                }
            }
        }
    }

    const exitCode = errored ? -1 : 0;
    cmd.debug && debugLn(`Exiting with error: ${errored} (code: ${exitCode})`);
    process.exit(exitCode);
};
