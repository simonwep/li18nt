<h3 align="center">
    <img src="https://user-images.githubusercontent.com/30767528/98481604-b27d5c00-21fb-11eb-916a-d991207ae616.png" alt="Logo" height="250">
</h3>

<h3 align="center">
    i18n translation files linter.
</h3>


<p align="center">
  <img alt="gzip size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/li18nt/lib/li18nt.min.mjs?compression=gzip">
  <img alt="brotli size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/li18nt/lib/li18nt.min.mjs?compression=brotli">
  <a href="https://github.com/Simonwep/li18nt/actions"><img
     alt="Build Status"
     src="https://github.com/Simonwep/li18nt/workflows/CI/badge.svg"/></a>
  <a href="https://www.npmjs.com/package/li18nt"><img
     alt="Install count"
     src="https://img.shields.io/npm/dm/li18nt.svg"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-27ae60.svg">
  <a href="https://www.jsdelivr.com/package/npm/li18nt"><img
     alt="JSDelivr download count"
     src="https://img.shields.io/jsdelivr/npm/hm/li18nt"></a>
  <img alt="Current version"
       src="https://img.shields.io/github/tag/Simonwep/li18nt.svg?color=3498DB&label=version">
  <a href="https://github.com/sponsors/Simonwep"><img
     alt="Support me"
     src="https://img.shields.io/badge/github-support-3498DB.svg"></a>
</p>

> Info: The README is always up-to-date with the latest commit, check out [releases](https://github.com/Simonwep/li18nt/releases) to see the docs for your version!

This linter will do three major things:
1. Finding conflicts: Comparing your files against each other to see if there are any properties with types not matching up.
2. Finding duplicates: Finding duplicates to reduce redundancy and elimitate duplicate translations.
3. Cleanup: Sorting all properties alphabetically which will make working with your file easier and maintain consistency across all your files.

It comes with a CLI and an API.


### Gettings started
Install via npm:

```sh
$ npm install li18nt
```

... or using yarn:

```sh
$ yarn add li18nt
```


### CLI Usage

Installing it will add `li18nt` (and the alias `lint-i18n`) to your command line.

Examples:
```sh
# Lint all json files in /locales
$ li18nt locales/*.json

# Lint all valid json files in /locales, print out only warnings and errors
$ li18nt locales/*.json --skip-invalid --quiet

# List all commands
$ li18nt --help
Usage: lint-i18n [files...] [options]

Lints your locales files, lint-i18n is an alias.

Options:
  -v, --version    Output the current version
  -q, --quiet      Print only errors and warnings
  -d, --debug      Debug information
  -f, --fix        Tries to fix existing errors
  --config [path]  Configuration file path (it'll try to resolve one in the current directory)
  --skip-invalid   Skip invalid files without exiting
  --report         Print system information
  -h, --help       Show this help text
```

Li18nt is configuration drive, you'll need to add a configuration. It'll try to resolve a  `.li18ntrc`, `.li18nt.json`,`.li18ntrc.json` or `li18nt.config.js`
in the current directory. Use the `--config [path]` option to specify a different path.

> The Li18nt config file is usually located in locales/.li18nt or in your root folder.

```json5
{
    // Override the --quiet cli option
    "quiet": false,

    // Override the --skip-invalid cli option
    "skipInvalid": false,

    // List of rules
    "rules": {

        // Checks if your files are properly formatted,
        // you can also just pass "warn" as value - 4 spaces are default
        "prettified": ["warn", {"indent": "tab"}],

        // Checks for conflicts
        "conflicts": "warn",

        // Check for duplicates
        "duplicates": ["warn", {
            "ignore": [
                // You can also use the array-sytax e.g. ["pages", "dashboard", "dashboard"]
                // If the specified target is an object it'll be skipped, e.g. you can ignore entire sub-trees
                "pages.dashboard.dashboard",

                // Use the * to match all properties in a tree
                "pages.*"
            ]
        }]
    }
}
```

The syntax for each option is:
```ts
type Rule = Mode | [Mode, Options | undefined];
```

where `Mode` can be `off`, `warn` or `error`. `off` won't do anything, `error` will exit with a non-zero code in case of errors.

### API Usage
This library comes in commonjs and ES6 format, you can include it directly:
```html
<script src="https://cdn.jsdelivr.net/npm/li18nt/lib/li18nt.min.js"></script>
```
... or using es6 modules:

```ts
import {...} from 'https://cdn.jsdelivr.net/npm/li18nt/lib/li18nt.min.mjs'
```

You can use the exported `lint` function to lint a set of objects.
Option- and result-types can be found [here](src/types.ts):

```ts
import {lint} from 'li18nt';

const options = {
    prettified: 4, // 4 spaces, use 'tab' for tabs
    duplicates: true, // We want to analyze our translations for duplicates
    conflicts: true // Find differences
};

const objects = [
    {a: 20, b: null, c: {x: 20}},
    {a: 50, b: 'Hello', c: {x: 100, y: 20}},
    {a: 'Five', b: 'Super', c: null}
];

const result = lint(options, objects);
console.log(result);
```


#### Utilities

Sometimes you may want to exclude certain properties from being linted, for that you can either specify a
property path as array (e.g. `['foo', 'bar', 4]`), as a string (`foo.bar[4]`), or you can use the `propertyPath` utility function to convert a string to an array:

```ts
import {lint, propertyPath} from 'li18nt';

const options = {
    duplicates: {
        ignore: [
            // Info: This is normally not requried as strings in ignore will automatically be converted to an array!

            /**
             * Returns ['b', 'a'], but you can use any valid js-property-path e.g.
             * foo[3].bar.baz['Hello "world"'].xy
             * would give us ['foo', 3, 'bar', 'baz', 'Hello "world"'].xy
             */
            propertyPath('b.a')
        ]
    }
};

const objects = [
    {a: 20, b: {a: 20}, c: {a: 20}}
];

const result = lint(options, objects);

// Will log Map {'a' => [['a'], [ 'c', 'a']]}
// The first element in the array will always be the first appereance of that property
console.log(result.duplicates[0]);
```
