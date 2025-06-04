function convertRtfToHtml(rtf) {
  if (!rtf || typeof rtf !== "string") return "";

  // Remove font table
  rtf = rtf.replace(/\\fonttbl[\s\S]+?;}/g, "");

  // Extract color table
  let colorTable = [];
  rtf = rtf.replace(/\\colortbl\s*;([^}]*)}/, (_, colors) => {
    colorTable = colors.split(";").map((color) => {
      const red = /\\red(\d+)/.exec(color);
      const green = /\\green(\d+)/.exec(color);
      const blue = /\\blue(\d+)/.exec(color);
      if (red && green && blue) {
        return `rgb(${red[1]},${green[1]},${blue[1]})`;
      }
      return null;
    });
    return "";
  });

  // Unicode characters (\uXXXX?)
  rtf = rtf.replace(/\\u(-?\d+)\??/g, (_, code) => {
    const num = parseInt(code, 10);
    return String.fromCharCode(num < 0 ? 65536 + num : num);
  });

  // Hexadecimal characters (\’e1)
  rtf = rtf.replace(/\\'([0-9a-f]{2})/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // Bold, italic, underline
  rtf = rtf
    .replace(/\\b\s?(.*?)\\b0/g, "<strong>$1</strong>")
    .replace(/\\i\s?(.*?)\\i0/g, "<em>$1</em>")
    .replace(/\\ul\s?(.*?)\\ulnone/g, "<u>$1</u>");

  // Color spans (\cfN ... \cf0)
  rtf = rtf.replace(/\\cf(\d+)\s?(.*?)(?=(\\cf\d+|\\cf0|$))/gs, (match, n, text) => {
    if (colorTable[n]) {
      return `<span style="color: ${colorTable[n]};">${text}</span>`;
    }
    return text;
  });
  rtf = rtf.replace(/\\cf0/g, "</span>");

  // Bullets (\u9679? or \bullet)
  rtf = rtf.replace(/\\u9679\?|\u2022|\\bullet/g, "•");

  // Paragraphs and line breaks
  rtf = rtf.replace(/\\par[d]?/g, "\n");

  // Remove remaining RTF commands and braces
  rtf = rtf.replace(/\\[a-z]+\d* ?/g, "");
  rtf = rtf.replace(/[{}]/g, "");

  // Handle lists: lines starting with bullet
  rtf = rtf.replace(/^[ \t]*•[ \t]*(.+)$/gm, "<li>$1</li>");
  // Group consecutive <li> into <ul>
  rtf = rtf.replace(/((?:<li>.*?<\/li>\s*){1,})/gs, (match) => `<ul>${match}</ul>`);

  // Paragraphs: split by double line breaks
  rtf = rtf
    .split(/\n{2,}/)
    .map((p) => p.trim() ? `<p>${p.trim()}</p>` : "")
    .join("");

  // Remove empty tags and extra whitespace
  rtf = rtf.replace(/<p>\s*<\/p>/g, "");
  rtf = rtf.replace(/<ul>\s*<\/ul>/g, "");
  rtf = rtf.replace(/\s+/g, " ");

  return rtf.trim();
}

module.exports = { convertRtfToHtml };