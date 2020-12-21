import {Conflicts} from '@tools/conflicts';
import {Duplicates, DuplicatesConfig} from '@tools/duplicates';
import {PatternConfig, PatternMismatch} from '@tools/pattern';
import {Indentation, PrettifyOptions} from '@tools/prettify';
import {Command} from 'commander';

export type Mode = 'off' | 'warn' | 'error';
export type Li18ntOption<T> = [Mode, T?]

export interface Li18ntOptions {
    prettified?: Indentation | PrettifyOptions;
    duplicates?: boolean | DuplicatesConfig;
    conflicts?: boolean;
    naming?: PatternConfig;
}

export type CLIRules = {
    prettified?: Li18ntOption<PrettifyOptions>;
    duplicates?: Li18ntOption<DuplicatesConfig>;
    conflicts?: Li18ntOption<boolean>;
}

export interface CLIOptions {
    rules: CLIRules;
    fix?: boolean;
    debug?: boolean;
    quiet?: boolean;
    config?: string;
    skipInvalid?: boolean;
    report?: boolean;
}

export interface SourceFile {
    content: JSONObject;
    source: string;
    filePath: string;
    name: string;
}

export interface CLIModuleArguments<Config> {
    files: SourceFile[];
    cmd: Command & CLIOptions;
    rule: Li18ntOption<Config>;
}

export interface CLIModule<Config = undefined> {
    (args: CLIModuleArguments<Config>): boolean | void;
}

export interface Li18ntResult {
    prettified?: string[];
    duplicates?: Duplicates[];
    conflicts?: Conflicts;
    naming?: PatternMismatch[][];
}

export type PropertyPath = (string | number)[];

export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export type JSONArray = JSONValue[] | JSONObject[];

export interface JSONObject {
    [key: string]: JSONValue;
}
