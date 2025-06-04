# rtf-to-html-converter

A simple JavaScript library to convert RTF (Rich Text Format) strings to HTML.

## Installation

```sh
npm install rtf-to-html-converter
```

## Usage

```js
const { convertRtfToHtml } = require('rtf-to-html-converter');

const rtf = String.raw`{\rtf1\ansi\ansicpg1252\deff0\nouicompat{\fonttbl{\f0\fnil\fcharset0 Arial;}{\f1\fnil\fcharset0 Arial Black;}}{\colortbl ;\red64\green64\blue64;}{\pard\fs30{\b\cf1 S\u237?ntomas principales:}\sb70\par}}`;

const html = convertRtfToHtml(rtf);

console.log(html);
```

## Features

- Converts RTF to HTML
- Supports bold, italic, underline
- Handles Unicode characters (e.g. `\u237?`)
- Basic support for lists and tables

## API

### `convertRtfToHtml(rtf: string): string`

Converts an RTF string to HTML.

#### Parameters

- `rtf` (string): The RTF string to convert.

#### Returns

- (string): The resulting HTML string.

## To run
In terminal vscode run:  node test

## License

ISC

## Author

Marcelo Saravia

## Contact

Find me at:

- Email: molinos456@hotmail.com, molinito48@gmail.com
- LinkedIn: [linkedin.com/in/marcelo-saravia-27128092](https://linkedin.com/in/marcelo-saravia-27128092)
- GitHub: [github.com/molinito](https://github.com/molinito)