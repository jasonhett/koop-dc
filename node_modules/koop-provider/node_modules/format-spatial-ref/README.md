# format-spatial-ref

> Format WKID spatial reference variations into a standard structure.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/format-spatial-ref.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/format-spatial-ref
[travis-image]: https://img.shields.io/travis/koopjs/format-spatial-ref.svg?style=flat-square
[travis-url]: https://travis-ci.org/koopjs/format-spatial-ref

## Install

```
npm install format-spatial-ref
```

## Usage

```js
var formatSpatialRef = require('format-spatial-ref')

formatSpatialRef({"wkid": 4326})
formatSpatialRef('{"wkid": 4326}')
formatSpatialRef(4326)

// All of the above will return { "wkid": 4326 }
```

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

[Apache-2.0](LICENSE)
