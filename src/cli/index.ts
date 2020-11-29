import {error} from '@utils/log';
import program from 'commander';
import {entry} from './entry';
import {printReport} from './printReport';
import {resolveConfiguration} from './resolveConfiguration';

const version = typeof VERSION === 'undefined' ? 'unknown' : VERSION;

const parseIndentation = (v: string): string | number | never => {
    if (v === 'tab') {
        return '\t';
    } else if (v.match(/^\d*$/g)) {
        return Number(v);
    }


    error('Invalid value for --indent, expected number (spaces) or \'tab\'.');
    process.exit(-4);
};

const parseMode = (flag: string) => (v: string): string | never => {
    if (['off', 'warn', 'error'].includes(v)) {
        return v;
    }

    error(`Invalid value for ${flag}, expected 'off', 'warn' or 'error'.`);
    process.exit(-4);
};

program
    .version(version, '-v, --version', 'Output the current version')
    .helpOption('-h, --help', 'Show this help text')
    .name('lint-i18n')
    .description('Lints your locales files, li18nt is an alias.')
    .usage('[files...] [options]')
    .arguments('[files...]')
    .option('-q, --quiet', 'Print only errors and warnings')
    .option('-d, --debug', 'Debug information')
    .option('-f, --fix', 'Tries to fix existing errors')
    .option('-p, --prettified [number|tab]', 'Check if files are properly formatted (default: 4 spaces)', parseIndentation)
    .option('--duplicates [off|warn|error]', 'Find duplicates (default: warn)', parseMode('--duplicates'))
    .option('--conflicts [off|warn|error]', 'Find type conflicts and missing properties (default: error)', parseMode('--conflicts'))
    .option('--config [path]', 'Use configuration file')
    .option('--skip-invalid', 'Skip invalid files without exiting')
    .option('--report', 'Prints system information at the end of the script')
    .action((args, cmd) => {

        // Print report and exit immediately
        if (cmd.report) {
            return printReport(version);
        }

        // TODO: See https://github.com/tj/commander.js/issues/1394
        cmd.prettify = cmd.prettify === true ? 4 : cmd.prettify;
        cmd.duplicates = cmd.duplicates === true ? 'warn' : cmd.duplicates;
        cmd.conflicts = cmd.conflicts === true ? 'error' : cmd.conflicts;

        // Try to resolve and load config file
        const options = resolveConfiguration(cmd);
        if (options) {
            cmd.prettified = options.prettified || cmd.prettify;
            cmd.duplicates = options.duplicates || cmd.duplicates;
            cmd.conflicts = options.conflicts || cmd.conflicts;
        }

        return entry(args, cmd);
    })
    .parse();
