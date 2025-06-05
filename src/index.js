function convertRtfToHtml(rtf) {
  if (!rtf || typeof rtf !== "string") return "";

  // Remove font table and font names
  rtf = rtf.replace(/\\fonttbl[\s\S]+?;}/g, "");
  rtf = rtf.replace(/\{\\f\d+\\fnil\\fcharset\d+ [^;]+;\}/g, "");

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

  // Replace non-breaking space (\~) with a normal space
  rtf = rtf.replace(/\\~/g, " ");

  // Color spans (\cfN ... \cf0)
  rtf = rtf.replace(/\\cf(\d+)/g, (match, n) => {
    if (colorTable[n]) {
      return `<span style="color: ${colorTable[n]};">`;
    }
    return "";
  });

  // Bold (\b ... \b0)
  rtf = rtf.replace(/\{\\b([^}]*)\}/gms, "<strong>$1</strong>");

  // Italic (\i ... \i0)
  rtf = rtf.replace(/\{\\i([^}]*)\}/gms, "<em>$1</em>");

  // Underline (\ul ... \ulnone)
  rtf = rtf.replace(/\{\\ul([^}]*)\}/gms, "<u>$1</u>");

  rtf = rtf.replace(/\\cf0/g, "</span>");

    // Merge <span style="color:..."> with <strong>, <em>, <u>
  rtf = rtf.replace(
    /<span style="color: ([^;]+);?">([\s\S]*?)<\/span>/g,
    (match, color, content) => {
      // Si el contenido es solo un strong/em/u, fusionar el style
      if (/^<strong>[\s\S]*<\/strong>$/.test(content)) {
        return content.replace(
          /^<strong>/,
          `<strong style="color: ${color};">`
        );
      }
      if (/^<em>[\s\S]*<\/em>$/.test(content)) {
        return content.replace(
          /^<em>/,
          `<em style="color: ${color};">`
        );
      }
      if (/^<u>[\s\S]*<\/u>$/.test(content)) {
        return content.replace(
          /^<u>/,
          `<u style="color: ${color};">`
        );
      }
      // Si hay varios estilos anidados, aplica el color al primero
      if (/^<(strong|em|u)>/.test(content)) {
        return content.replace(
          /^<(strong|em|u)>/,
          `<$1 style="color: ${color};">`
        );
      }
      // Si no, dejar el span como está
      return `<span style="color: ${color};">${content}</span>`;
    }
  );

  // Bullets (\u9679? or \bullet)
  rtf = rtf.replace(/\\u9679\?|\u2022|\\bullet/g, "•");

  // List items: lines starting with bullet or number
  rtf = rtf.replace(/(?:^|\n)[ \t]*•[ \t]*(.+)/g, "\n<li>$1</li>");
  rtf = rtf.replace(/(?:^|\n)[ \t]*\d+\.[ \t]*(.+)/g, "\n<li>$1</li>");

  // Group consecutive <li> into <ul>
  rtf = rtf.replace(/((?:<li>.*?<\/li>\s*){1,})/gs, (match) => `<ul>${match}</ul>`);

  // Paragraphs and line breaks
  rtf = rtf.replace(/\\par[d]?/g, "</div><div>");
  rtf = `<div>${rtf}</div>`;

  // Remove remaining RTF commands and braces
  rtf = rtf.replace(/\\[a-z]+\d* ?/g, "");
  rtf = rtf.replace(/[{}]/g, "");

  // Replace empty <div> or <div> with only spaces with &nbsp; for visual separation
  rtf = rtf.replace(/<div>\s*<\/div>/g, "<div>&nbsp;</div>");

  // Clean up consecutive empty divs and whitespace
  rtf = rtf.replace(/(<div>&nbsp;<\/div>)+/g, "<div>&nbsp;</div>");
  rtf = rtf.replace(/<\/div><div>/g, "</div>\n<div>");

  // Remove extra newlines
  rtf = rtf.replace(/\n{2,}/g, "\n");

  return rtf.trim();
}

module.exports = { convertRtfToHtml };