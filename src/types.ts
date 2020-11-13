import {Command} from 'commander';

export type Li18ntOptions = {
    debug?: boolean;
    quiet?: boolean;
    prettify?: number | string;
    duplicates?: 'strict' | 'loose';
    diff?: 'strict' | 'loose';
};

export type SourceFile = {
    content: JSONObject;
    filePath: string;
    name: string;
};

export type CLIModuleArguments = {
    files: SourceFile[];
    cmd: Command & Li18ntOptions;
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
