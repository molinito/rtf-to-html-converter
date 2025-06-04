const { convertRtfToHtml } = require('./src/index');

const rtf = String.raw`{\rtf1\ansi\ansicpg1252\deff0\nouicompat{\fonttbl{\f0\fnil\fcharset0 Arial;}{\f1\fnil\fcharset0 Arial Black;}{\f2\fnil\fcharset0 Courier New;}{\f3\fnil\fcharset0 Georgia;}{\f4\fnil\fcharset0 Tahoma;}{\f5\fnil\fcharset0 Times New Roman;}{\f6\fnil\fcharset0 Verdana;}}{\colortbl ;\red64\green64\blue64;}{\pard\fs30{\b\cf1 S\u237?ntomas principales:}\sb70\par}{\pard{\cf1 \u9679?\~\~\~\~Fiebre de}{\b\cf1 38.5\u176?C}{\cf1 .}\sb70\par}{\pard{\cf1 \u9679?\~\~\~\~}{\i\cf1 Tos seca y congesti\u243?n nasal}{\cf1 .}\sb70\par}{\pard\fs30{\b\cf1 Recomendaciones:}\sb70\par}{\pard\line\line\sb70\par}}`;

console.log(convertRtfToHtml(rtf));