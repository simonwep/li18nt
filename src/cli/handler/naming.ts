import {pattern, PatternConfig} from '@lib';
import {CLIModule} from '@types';
import chalk from 'chalk';
import {generateList} from '@shared';
import {getLoggingSet, successLn} from '../utils/log';
import {pluralize} from '../utils/pluralize';
import {prettyPropertyPath} from '../utils/prettyPropertyPath';

/* eslint-disable no-console */
export const namingHandler: CLIModule<PatternConfig> = ({files, cmd, rule}) => {
    const [mode, options] = rule;
    const {logLn, accent} = getLoggingSet(mode);

    let errors = 0;
    for (const {name, content} of files) {
        const mismatches = pattern(content, options);

        if (mismatches.length) {
            logLn(`${accent(`${name}:`)} Found ${pluralize('mismatch', mismatches.length)}:`);

            for (const {path, failed} of mismatches) {
                process.stdout.write(`    ${prettyPropertyPath(path, chalk.cyanBright)}: `);

                if (failed.length > 1) {
                    process.stdout.write('\n');

                    for (const [num, pattern] of generateList(failed)) {
                        console.log(`       ${num}. ${chalk.blueBright(pattern)}`);
                    }
                } else if (failed.length) {
                    console.log(chalk.blueBright(failed[0]));
                }
            }

            errors++;
        }
    }

    !errors && !cmd.quiet && successLn('No duplicates found!');
    return !errors;
};
