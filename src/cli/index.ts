import {CLIOptions, CLIRules, Mode} from '@types';
import {Command, program} from 'commander';
import {entry} from './entry';
import {warnLn} from './utils/log';
import {printReport} from './utils/printReport';
import {resolveConfiguration} from './utils/resolveConfiguration';

const version = typeof VERSION === 'undefined' ? 'unknown' : VERSION;

/* eslint-disable @typescript-eslint/no-explicit-any */
const processRule = (mode: Mode | [Mode, unknown]): [Mode, any] => {
    return typeof mode === 'string' ? [mode, undefined] : mode;
};

const undefinedOr = <A>(a: A | undefined, b: A | undefined) => {
    return typeof a !== 'undefined' ? a : b;
};

program
    .version(version, '-v, --version', 'Output the current version')
    .helpOption('-h, --help', 'Show this help text')
    .name('lint-i18n')
    .description('Lints your locales files, lint-i18n is an alias.')
    .usage('[files...] [options]')
    .arguments('[files...]')
    .option('-q, --quiet', 'Print only errors and warnings')
    .option('-d, --debug', 'Debug information')
    .option('-f, --fix', 'Tries to fix existing errors')
    .option('--config [path]', 'Configuration file path (it\'ll try to resolve one in the current directory)')
    .option('--skip-invalid', 'Skip invalid files without exiting')
    .option('--report', 'Print system information')
    .action((args: any, cmd: Command & CLIOptions) => {

        // Print report and exit immediately
        if (cmd.report) {
            return printReport(version);
        }

        // Try to resolve and load config file
        const options = resolveConfiguration(cmd);
        if (options) {

            // Override options
            cmd.quiet = undefinedOr(cmd.quiet, options.quiet);
            cmd.skipInvalid = undefinedOr(cmd.skipInvalid, options.skipInvalid);
            cmd.rules = options.rules || {};

            for (const [name, value] of Object.entries(cmd.rules)) {
                cmd.rules[name as keyof CLIRules] = processRule(value as Mode | [Mode, unknown]);
            }
        } else {
            return warnLn('Missing configuration file.');
        }

        return entry(args, cmd);
    })
    .parse();
