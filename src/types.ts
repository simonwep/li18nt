import {Command} from 'commander';

export type CLIOptions = {
    debug: boolean;
    prettify: boolean;
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

export type PropertyPath = (string | number)[];

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export type JSONArray = JSONValue[] | JSONObject[];

export interface JSONObject {
    [key: string]: JSONValue;
}
