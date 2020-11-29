/* eslint-disable no-console */
import chalk from 'chalk';

const {stdout} = process;

export const blankLn = (str: string): void => blank(`${str}\n`);
export const warnLn = (str: string): void => warn(`${str}\n`);
export const errorLn = (str: string): void => error(`${str}\n`);
export const successLn = (str: string): void => success(`${str}\n`);
export const infoLn = (str: string): void => info(`${str}\n`);
export const debugLn = (str: string): void => debug(`${str}\n`);

export const blank = (str: string): void => {
    stdout.write(str);
};

export const warn = (str: string): void => {
    stdout.write(`${chalk.yellowBright('[!]')} ${str}`);
};

export const error = (str: string): void => {
    stdout.write(`${chalk.redBright('[X]')} ${str}`);
};

export const success = (str: string): void => {
    stdout.write(`${chalk.greenBright('[✓]')} ${str}`);
};

export const info = (str: string): void => {
    stdout.write(`${chalk.blueBright('[i]')} ${str}`);
};

export const debug = (str: string): void => {
    stdout.write(`[-] ${str}`);
};
