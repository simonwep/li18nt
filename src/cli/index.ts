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
    .option('-q, --quiet', 'Print only errors and warnings')
    .option('-d, --debug', 'Debug information')
    .option('-p, --prettify', 'Prettify files')
    .option('--duplicates [mode]', 'Find duplicates')
    .option('--diff [mode]', 'Find differences and conflicts')
    .action(entry)
    .parse();

