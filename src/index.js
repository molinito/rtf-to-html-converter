function convertRtfToHtml(rtf) {
  if (!rtf || typeof rtf !== "string") return "";

  // Replace Unicode characters (\uXXXX?)
  rtf = rtf.replace(/\\u(-?\d+)\??/g, (_, code) => {
    const num = parseInt(code, 10);
    return String.fromCharCode(num < 0 ? 65536 + num : num);
  });

  // Decode hexadecimal characters (\’e1)
  rtf = rtf.replace(/\\'([0-9a-f]{2})/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // Colors: extract color table and replace \cfN with span with color
  let colorTable = [];
  rtf = rtf.replace(/\\colortbl;(.*?);}/, (_, colors) => {
    colorTable = colors
      .split(";")
      .map((c) => {
        const m = c.match(/\\red(\d+)\s*\\green(\d+)\s*\\blue(\d+)/);
        return m ? `rgb(${m[1]},${m[2]},${m[3]})` : null;
      });
    return "";
  });
  rtf = rtf.replace(/\\cf(\d+)/g, (_, n) =>
    colorTable[n] ? `<span style="color:${colorTable[n]}">` : ""
  );
  // Close color spans at the end of each group
  rtf = rtf.replace(/\\cf0/g, "</span>");

  // Bold, italic, underline (supports nesting)
  rtf = rtf
    .replace(/\\b\s?(.*?)\\b0/g, "<strong>$1</strong>")
    .replace(/\\i\s?(.*?)\\i0/g, "<em>$1</em>")
    .replace(/\\ul\s?(.*?)\\ulnone/g, "<u>$1</u>");

  // Bullet lists (● or \u9679? or \bullet)
  rtf = rtf.replace(
    /\\pard[^{]*?(?:\\pntext\\'b7|\\u9679\?|\\bullet)\s?(.*?)\\par/g,
    "<li>$1</li>"
  );
  // Simple numbered lists (\pntext\d+)
  rtf = rtf.replace(
    /\\pard[^{]*?\\pntext\d+\s?(.*?)\\par/g,
    "<li>$1</li>"
  );

  // Group consecutive <li> in <ul> or <ol>
  rtf = rtf.replace(
    /((?:<li>[\s\S]*?<\/li>\s*){2,})/g,
    (match) => `<ul>${match}</ul>`
  );

  // Paragraph and line breaks
  rtf = rtf
    .replace(/\\par/g, "<br>")
    .replace(/\\line/g, "<br>");

  // Clean remaining RTF commands and braces
  rtf = rtf.replace(/\\[a-z]+\d* ?/g, "");
  rtf = rtf.replace(/[{}]/g, "");

  // Clean extra spaces and close open spans
  rtf = rtf.replace(/<br>\s*<br>/g, "<br>");
  rtf = rtf.replace(/(<span [^>]+>)([^<]*)$/, "$1$2</span>");

  // Remove empty spans
  rtf = rtf.replace(/<span style="color:[^"]+"><\/span>/g, "");

  return `<div>${rtf.trim()}</div>`;
}

module.exports = { convertRtfToHtml };