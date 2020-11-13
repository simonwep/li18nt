import {Conflicts} from '@tools/conflicts';
import {Duplicates} from '@tools/duplicates';
import {Command} from 'commander';

export interface Li18ntOptions {
    prettify?: number | string;
    duplicates?: boolean;
    conflicts?: boolean
}

export interface CLIOptions {
    prettify?: number | string;
    duplicates?: 'strict' | 'loose';
    conflicts?: 'strict' | 'loose';
    debug?: boolean;
    quiet?: boolean;
}

export interface SourceFile {
    content: JSONObject;
    filePath: string;
    name: string;
}

export interface CLIModuleArguments {
    files: SourceFile[];
    cmd: Command & CLIOptions;
}

export interface CLIModule {
    (args: CLIModuleArguments): boolean | void;
}

export interface Li18ntResult {
    prettified?: string[];
    duplicates?: Duplicates[];
    conflicts?: Conflicts;
}

export type PropertyPath = (string | number)[];

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export type JSONArray = JSONValue[] | JSONObject[];

export interface JSONObject {
    [key: string]: JSONValue;
}
