# rtf-to-html-converter

A robust JavaScript library to convert RTF (Rich Text Format) strings to clean, readable HTML.

[![npm version](https://img.shields.io/npm/v/rtf-to-html-converter.svg)](https://www.npmjs.com/package/rtf-to-html-converter)
[![GitHub stars](https://img.shields.io/github/stars/molinito/rtf-to-html-converter.svg)](https://github.com/molinito/rtf-to-html-converter)

## Installation

```sh
npm install rtf-to-html-converter
```

## Usage

```js
const { convertRtfToHtml } = require('rtf-to-html-converter');

const rtf = String.raw`{\rtf1\ansi\ansicpg1252\deff0\nouicompat{\fonttbl{\f0\fnil\fcharset0 Arial;}{\f1\fnil\fcharset0 Arial Black;}}{\colortbl ;\red64\green64\blue64;\red255\green0\blue0;}{\pard\fs30{\b\cf1 Main symptoms:}\sb70\par}{\pard{\b\cf2 Warning in red}\sb70\par}}`;

const html = convertRtfToHtml(rtf);

console.log(html);
```

## Features

- Converts RTF to HTML with support for:
  - **Bold**, *italic*, and <u>underline</u> text
  - Text color (RTF color table and `\cfN` codes)
  - Unicode characters (e.g. `\u237?`)
  - Bulleted and numbered lists
  - Paragraph and line break handling
  - Non-breaking spaces
- Cleans up empty paragraphs and extra whitespace
- Compatible with both JavaScript and TypeScript projects (includes type definitions)
- Outputs HTML using `<div>`, `<strong>`, `<em>`, `<u>`, `<span style="color:...">`, `<ul>`, `<li>`, etc.

## Limitations / Known Issues

- Does not support RTF tables, images, or embedded objects.
- Only basic text formatting is supported (bold, italic, underline, color, lists, paragraphs).
- Font face and font size are ignored.
- Complex nested RTF structures may not be fully converted.
- Only the color table defined in the RTF is used for color conversion.
- Output is intended for display, not for round-trip editing back to RTF.

## API

### `convertRtfToHtml(rtf: string): string`

Converts an RTF string to HTML.

#### Parameters

- `rtf` (`string`): The RTF string to convert.

#### Returns

- `string`: The resulting HTML string.

## Example Output

```html
<div><strong style="color: rgb(64,64,64);">Main symptoms:</strong></div>
<div>&nbsp;</div>
<div><strong style="color: rgb(255,0,0);">Warning in red</strong></div>
```

## How to run tests

In your VS Code terminal, run:

```sh
node test
```

## License

ISC

## Maintainers & Contributions

This repository is open source and free to use under the ISC license.  
Only the original author can modify or publish new versions to this repository and npm.  
If you wish to suggest improvements, please open an issue or a pull request—changes will only be merged at the author's discretion.

## Author

Marcelo Saravia

## Contact

- Email: molinos456@hotmail.com, molinito48@gmail.com
- LinkedIn: [linkedin.com/in/marcelo-saravia-27128092](https://linkedin.com/in/marcelo-saravia-27128092)
- GitHub: [github.com/molinito](https://github.com/molinito)

## Support this project

If you find this library useful, you can support its development by buying me a coffee:

Paypal: [paypal.me/molinito12](https://paypal.me/molinito12)

