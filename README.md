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
  --version                    Output the current version
  -q, --quiet                  Print only errors and warnings
  -d, --debug                  Debug information
  -p, --prettify [number|tab]  Prettify files (default: 4 spaces)
  --duplicates [strict|loose]  Find duplicates (default: loose)
  --conflicts [strict|loose]   Find type conflicts and missing properties (default: strict)
  -h, --help                   Show this help text
```


#### Modes

Both `--conflicts` and `--duplicates` both come with a `loose` and `strict` mode. `loose` means that, in case there is something wrong with your files, an error won't be thrown. `strict` tells the linter that an error **should** be thrown.

For `--conflicts` it's normally `strict` as you will probably want to keep your files consistent and for `--duplicates` it's `loose` because translations may differ.


### API Usage
This library comes in commonjs and ES6 format, you can include it directly:
```html
<script src="https://cdn.jsdelivr.net/npm/li18nt/lib/li18nt.min.js"></script>
```
... or using modules:

```ts
import {lint, version} from 'https://cdn.jsdelivr.net/npm/li18nt/lib/li18nt.min.mjs'
```

You can use it the following, option- and result-types can be found [here](src/types.ts):

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

