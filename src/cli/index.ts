import {program} from 'commander';
import {entry} from './entry';

const version = typeof VERSION === 'undefined' ? 'unknown' : VERSION;

program
    .version(version, '--version', 'Output the current version')
    .helpOption('-h, --help', 'Show this help text')
    .name('lint-i18n')
    .description('Lints your locales files, li18nt is an alias.')
    .usage('[files...] [options]')
    .arguments('[files...]')
    .option('-d, --debug', 'Debug information')
    .option('-p, --pretty', 'Prettify files')
    .option('-d, --duplicates [mode]', 'Find duplicates', 'loose')
    .option('-c, --diff [mode]', 'Find differences and conflicts', 'strict')
    .action(entry)
    .parse();

