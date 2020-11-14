import {error} from '@utils/log';
import program from 'commander';
import {entry} from './entry';
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
    if (['strict', 'loose'].includes(v)) {
        return v;
    }

    error(`Invalid value for ${flag}, expected 'strict' or 'loose'.`);
    process.exit(-4);
};

program
    .version(version, '--version', 'Output the current version')
    .helpOption('-h, --help', 'Show this help text')
    .name('lint-i18n')
    .description('Lints your locales files, li18nt is an alias.')
    .usage('[files...] [options]')
    .arguments('[files...]')
    .option('-q, --quiet', 'Print only errors and warnings')
    .option('-d, --debug', 'Debug information')
    .option('-p, --prettify [number|tab]', 'Prettify files (default: 4 spaces)', parseIndentation)
    .option('--duplicates [strict|loose]', 'Find duplicates (default: loose)', parseMode('--duplicates'))
    .option('--conflicts [strict|loose]', 'Find type conflicts and missing properties (default: strict)', parseMode('--conflicts'))
    .option('--config [path]', 'Use configuration file')
    .action((args, cmd) => {

        // TODO: See https://github.com/tj/commander.js/issues/1394
        cmd.prettify = cmd.prettify === true ? 4 : cmd.prettify;
        cmd.duplicates = cmd.duplicates === true ? 'loose' : cmd.duplicates;
        cmd.conflicts = cmd.conflicts === true ? 'strict' : cmd.conflicts;

        // Try to resolve and load config file
        const options = resolveConfiguration(cmd);
        if (options) {
            cmd.prettify = options.prettify || cmd.prettify;
            cmd.duplicates = options.duplicates || cmd.duplicates;
            cmd.conflicts = options.conflicts || cmd.conflicts;
        }

        entry(args, cmd);
    })
    .parse();
