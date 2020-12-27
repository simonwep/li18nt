import {CLIModule, CLIRules} from '@types';
import {conflictsHandler} from './conflicts';
import {duplicatesHandler} from './duplicates';
import {namingHandler} from './naming';
import {prettifyHandler} from './prettify';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handler: [keyof CLIRules, CLIModule<any>][] = [
    ['conflicts', conflictsHandler],
    ['duplicates', duplicatesHandler],
    ['naming', namingHandler],
    ['prettified', prettifyHandler]
];
