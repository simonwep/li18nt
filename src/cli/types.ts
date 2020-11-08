import {JSONObject} from '@types';
import {Command} from 'commander';

export type CLIOptions = {
    debug: boolean;
    pretty: boolean;
    duplicates: true | 'strict' | 'loose';
    diff: true | 'strict' | 'loose';
}

export type SourceFile = {
    content: JSONObject;
    name: string;
    filePath: string;
};

export type CLIModuleArguments = {
    files: SourceFile[];
    cmd: Command & CLIOptions;
}

export interface CLIModule {
    (args: CLIModuleArguments): boolean | void;
}
