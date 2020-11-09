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

# Prettify your files, check for differences and duplicates
$ li18nt locales/*.json --pretty --diff --duplicates

# List all commands
$ li18nt --help
```

#### Modes

Both `--diff` and `--duplicates` both come with a `loose` and `strict` mode. `loose` means that, in case there is something wrong with your files, an error won't be thrown. `strict` tells the linter that an error **should** be thrown.

For `--diff` it's normally `strict` as you will probably want to keep your files consistent and for `--duplicates` it's `loose` because translations may differ.


### API Usage
This library comes in commonjs and ES6 format, you can include it directly:
```html
<script src="https://cdn.jsdelivr.net/npm/li18nt/lib/li18nt.min.js"></script>
```
... or using modules:

```ts
import {...} from 'https://cdn.jsdelivr.net/npm/li18nt/lib/li18nt.min.mjs'
```

#### `difference`
Used to detect differences / conflicts between objects:

```ts
import {difference} from 'li18nt';

const diff = difference([
    {a: 10, b: {x: 20}},
    {a: '10', b: {x: 20}},
    {a: 30, b: {x: 20, y: 'Hello'}}
]);

console.log(JSON.stringify(diff, null, 2));
```

Output:
```js
[
    {
        'conflicts': [['a']], // Conflicts with 2nd object
        'missing': [['b', 'y']] // 3rd object has this property
    },
    {
        'conflicts': [['a']], // Conflicts with 1st object
        'missing': [['b', 'y']] // 3rd object has this property
    },
    {
        'conflicts': [['a']], // Conflicts with 2nd object
        'missing': []
    }
];
```

#### `duplicates`
Will find re-used keys, can be used to reduce redundancy and duplicate translations:

```ts
import {duplicates} from 'li18nt';

const dupes = duplicates({
    a: 10,
    x: {
        y: {
            b: {
                x: 20
            }
        }
    },
    b: {
        x: 20,
        a: 20
    }
});

const obj = Object.fromEntries([...dupes.entries()]);
console.log(JSON.stringify(obj, null, 2));
```

Output:
```js
{
    'x': [
        ['b', 'x'], // Already present root.x.y.b.x
    ],
    'a': [
        ['b', 'a'] // Already present in root.a
    ]
};
```


#### `sort`
Used to stringify an object and sorting its properties alphabetically:

> The second argument is the same as the third one for JSON.stringify!

```ts
import {sort} from 'li18nt';

const sorted = sort({
    'hello': 'world',
    'baz': 'baz',
    'abc': 'abc',
    'bar': 'bar',
    'list': ['hello', 'world', 'abc'],
    'sub': {
        'foo': 'foo',
        'bam': 'bam'
    }
}, 4);

console.log(sorted);
```

```json
{
    "abc": "abc",
    "bar": "bar",
    "baz": "baz",
    "hello": "world",
    "list": [
        "hello",
        "world",
        "abc"
    ],
    "sub": {
        "bam": "bam",
        "foo": "foo"
    }
}
```
