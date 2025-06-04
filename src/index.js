function convertRtfToHtml(rtf) {
  if (!rtf || typeof rtf !== "string") return "";

  // Remove font and color tables
  rtf = rtf.replace(/\\fonttbl[\s\S]+?;}/g, "");
  rtf = rtf.replace(/\\colortbl[\s\S]+?;}/g, "");

  // Replace Unicode characters (\uXXXX?)
  rtf = rtf.replace(/\\u(-?\d+)\??/g, (_, code) => {
    const num = parseInt(code, 10);
    return String.fromCharCode(num < 0 ? 65536 + num : num);
  });

  // Decode hexadecimal characters (\’e1)
  rtf = rtf.replace(/\\'([0-9a-f]{2})/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // Bold, italic, underline
  rtf = rtf
    .replace(/\\b\s?(.*?)\\b0/g, "<strong>$1</strong>")
    .replace(/\\i\s?(.*?)\\i0/g, "<em>$1</em>")
    .replace(/\\ul\s?(.*?)\\ulnone/g, "<u>$1</u>");

  // Bullet lists (\u9679? or \bullet)
  rtf = rtf.replace(/\\pard[^{]*?(?:\\u9679\?|\\bullet)\s?(.*?)\\par/g, "<li>$1</li>");
  // Group consecutive <li> in <ul>
  rtf = rtf.replace(/((?:<li>[\s\S]*?<\/li>\s*){2,})/g, (match) => `<ul>${match}</ul>`);
  // Remove nested <ul>
  rtf = rtf.replace(/<\/ul>\s*<ul>/g, "");

  // Paragraphs
  rtf = rtf.replace(/\\pard/g, "");
  rtf = rtf.replace(/\\par/g, "<br>");

  // Remove remaining RTF commands and braces
  rtf = rtf.replace(/\\[a-z]+\d* ?/g, "");
  rtf = rtf.replace(/[{}]/g, "");

  // Clean up extra spaces and line breaks
  rtf = rtf.replace(/<br>\s*<br>/g, "<br>");
  rtf = rtf.replace(/^\s+|\s+$/g, "");

  return `<div>${rtf.trim()}</div>`;
}

module.exports = { convertRtfToHtml };