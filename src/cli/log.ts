/* eslint-disable no-console */
import chalk from 'chalk';

export const warn = (str: string): void => {
    console.log(`${chalk.yellowBright('[⚠]')} ${str}`);
};

export const error = (str: string): void => {
    console.log(`${chalk.redBright('[X]')} ${str}`);
};

export const success = (str: string): void => {
    console.log(`${chalk.greenBright('[✓]')} ${str}`);
};

export const info = (str: string): void => {
    console.log(`${chalk.blueBright('[i]')} ${str}`);
};

export const debug = (str: string): void => {
    console.log(`'[-]' ${str}`);
};

