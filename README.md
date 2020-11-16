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
# Prettify your files (this will sort all your properties alphabetically)
$ li18nt locales/*.json --pretty

# Prettify your files, check for conflicts / missing properties and duplicates
$ li18nt locales/*.json --pretty --conflicts --duplicates

# List all commands
$ li18nt --help
Usage: lint-i18n [files...] [options]

Lints your locales files, li18nt is an alias.

Options:
  -v, --version                Output the current version
  -q, --quiet                  Print only errors and warnings
  -d, --debug                  Debug information
  -p, --prettify [number|tab]  Prettify files (default: 4 spaces)
  -t, --test                   Used in combination with --prettify, will validate the current formatting
  --duplicates [strict|loose]  Find duplicates (default: loose)
  --conflicts [strict|loose]   Find type conflicts and missing properties (default: strict)
  --config [path]              Use configuration file
  -h, --help                   Show this help text
```

The following file-names can be used as configuration: `.li18ntrc`, `.li18nt.json`,`.li18ntrc.json` or `li18nt.config.js`.
A configuration file will override specified properties. Example:

```json5
{
    // true will use the default value (strict), you may pass "loose" or "strict" explicitly
    "conflicts": true,

    // Use a number for spaces, '\t' for tabs, false or leave it out to disable
    "prettify": 4,

    // Here you can either pass true ("loose"), false, "strict", "loose" or an extended configuration object.
    "duplicates": {
        "mode": "loose", // Mode is now a sub-property
        "ignore": [

            // You can also use the array-sytax e.g. ["pages", "dashboard", "dashboard"]
            // If the specified target is an object it'll be skipped, e.g. you can ignore entire sub-trees
            "pages.dashboard.dashboard"
        ]
    }
}
```


#### Modes

Both `--conflicts` and `--duplicates` both come with a `loose` and `strict` mode. `loose` means that, in case there is something wrong with your files, an error won't be thrown. `strict` tells the linter that an error **should** be thrown.

For `--conflicts` it's normally `strict` as you will probably want to keep your files consistent and for `--duplicates` it's `loose` because translations may differ.

#### Example output:
Using `--conflicts`, `--duplicates` and `--prettify` on "corrupt" files would look like this (example):

<img src="https://user-images.githubusercontent.com/30767528/99299539-a290f800-284b-11eb-99f8-cc0d4b4fe38b.png" alt="example output" height="450">


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
    prettify: 4, // 4 spaces, use '\t' for tabs
    duplicates: true, // We want to analyze our translations for duplicates
    diff: true // Find differences
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
