import {pattern, PatternConfig} from '@tools/pattern';
import {CLIModule} from '@types';
import {getLoggingSet, successLn} from '@utils/log';
import {makeList} from '@utils/makeList';
import {pluralize} from '@utils/pluralize';
import {prettyPropertyPath} from '@utils/prettyPropertyPath';
import chalk from 'chalk';

/* eslint-disable no-console */
export const namingFlag: CLIModule<PatternConfig> = ({files, cmd, rule}) => {
    const [mode, options] = rule;
    const {logLn, accent} = getLoggingSet(mode);

    let count = 0;
    for (const {name, content} of files) {
        const mismatches = pattern(content, options);

        if (mismatches.length) {
            logLn(`${accent(`${name}:`)} Found ${pluralize('mismatch', mismatches.length)}:`);

            for (const {path, failed} of mismatches) {
                process.stdout.write(`    ${prettyPropertyPath(path, chalk.cyanBright)}: `);

                if (failed.length > 1) {
                    process.stdout.write('\n');

                    for (const [num, pattern] of makeList(failed)) {
                        console.log(`       ${num}. ${chalk.blueBright(pattern)}`);
                    }
                } else if (failed.length) {
                    console.log(chalk.blueBright(failed[0]));
                }
            }

            count++;
        }
    }

    !count && !cmd.quiet && successLn('No duplicates found!');
    return mode === 'warn' || !count;
};
