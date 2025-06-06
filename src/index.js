function convertRtfToHtml(rtf) {
  if (!rtf || typeof rtf !== "string") return "";

  // Remove font table
  rtf = rtf.replace(/\\fonttbl[\s\S]+?;}/g, "");
  rtf = rtf.replace(/\{\\f\d+\\fnil\\fcharset\d+ [^;]+;\}/g, "");

  // Extract and remove color table
  let colorTable = {};
  let colorTableMatch = rtf.match(/\\colortbl\s*;([^}]*)}/);
  if (colorTableMatch) {
    const colors = colorTableMatch[1].split(";").filter(c => c.trim() !== "");
    colors.forEach((colorDef, index) => {
      const red = (colorDef.match(/\\red(\d+)/) || [])[1] || 0;
      const green = (colorDef.match(/\\green(\d+)/) || [])[1] || 0;
      const blue = (colorDef.match(/\\blue(\d+)/) || [])[1] || 0;
      colorTable[index + 1] = `rgb(${red},${green},${blue})`;
    });
    // Remove color table from RTF
    rtf = rtf.replace(/\\colortbl\s*;[^}]*}/, "");
  }

  // --- BULLET HANDLING (robust for most RTF cases) ---

  // 1. Detect bullet character in list definition (e.g., {\pntxtb\'B7})
  let bulletChar = "•"; // Default bullet
  const bulletMatch = rtf.match(/\\pntxtb\\'([0-9a-f]{2})/i);
  if (bulletMatch) {
    bulletChar = String.fromCharCode(parseInt(bulletMatch[1], 16));
  }

  // 2. Replace any RTF bullet definition with actual bullet character (before removing list definitions)
  rtf = rtf.replace(/\\pntxtb\\'([0-9a-f]{2})/gi, bulletChar);
  rtf = rtf.replace(/\\pntxtb\\'95/gi, bulletChar); // Sometimes \u8226? or \'95 for bullet

  // 3. Replace unicode bullets
  rtf = rtf.replace(/\\u8226\?/g, bulletChar);
  rtf = rtf.replace(/\\u9679\?/g, bulletChar);

  // 4. Replace literal \bullet
  rtf = rtf.replace(/\\bullet/g, bulletChar);

  // 5. Replace hexadecimal bullets outside definitions
  rtf = rtf.replace(/\\'[bB]7/g, bulletChar);
  rtf = rtf.replace(/\\'95/g, bulletChar);

  // 6. Insert bullet at the start of each list item if the list definition uses \pntext\tab
  rtf = rtf.replace(/\{\\pntext\\tab\}/g, bulletChar + " ");

  // 7. Remove RTF list/numbering definitions (blocks like {\*\pn...})
  rtf = rtf.replace(/\{\\\*\\pn[\s\S]+?\}/g, "");

  // --- END BULLET HANDLING ---

  // Convert unicode characters (\uXXXX?)
  rtf = rtf.replace(/\\u(-?\d+)\??/g, (_, code) => {
    const num = parseInt(code, 10);
    return String.fromCharCode(num < 0 ? 65536 + num : num);
  });

  // Convert hexadecimal characters (\’e1)
  rtf = rtf.replace(/\\'([0-9a-f]{2})/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // Non-breaking spaces (\~)
  rtf = rtf.replace(/\\~/g, " ");

  // Handle colors (\cfN ... \cf0)
  rtf = rtf.replace(/\\cf(\d+)/g, (match, n) => {
    const color = colorTable[n];
    if (color) {
      return `[[COLOR_START:${color}]]`;
    }
    return "";
  });

  rtf = rtf.replace(/\\cf0/g, "[[COLOR_END]]");

  // Bold (\b ... \b0)
  rtf = rtf.replace(/\{\\b([^}]*)\}/gms, "<strong>$1</strong>");

  // Italic (\i ... \i0)
  rtf = rtf.replace(/\{\\i([^}]*)\}/gms, "<em>$1</em>");

  // Underline (\ul ... \ulnone)
  rtf = rtf.replace(/\{\\ul([^}]*)\}/gms, "<u>$1</u>");

  // Paragraphs
  rtf = rtf.replace(/\\par[d]?/g, "</div><div>");
  rtf = `<div>${rtf}</div>`;

  // Remove remaining RTF commands and braces
  rtf = rtf.replace(/\\[a-z]+\d* ?/g, "");
  rtf = rtf.replace(/[{}]/g, "");

  // Remove leftover numbers from paragraph formatting (e.g., -360, 720, etc.)
  rtf = rtf.replace(/(^|[>\s])\-?\d+\b/g, "$1");

  // Apply color spans
  rtf = rtf
    .replace(/\[\[COLOR_START:([^\]]+)\]\]/g, '<span style="color: $1;">')
    .replace(/\[\[COLOR_END\]\]/g, '</span>');

  // Handle bullets (fallbacks)
  rtf = rtf.replace(/\\u9679\?|\u2022|\\bullet/g, bulletChar);

  // Handle RTF numbered list items ({\pntext\tab}...) to <li>...</li>
  rtf = rtf.replace(/\{\\pntext\\tab\}([^\n<]*)/g, (match, item) => {
    return `<li>${item.trim()}</li>`;
  });

  // Group consecutive <li> into <ol>
  rtf = rtf.replace(/((?:<li>.*?<\/li>\s*){2,})/gs, (match) => `<ol>${match}</ol>`);

  // Group bullet/numbered list items into <ul> (for bullets) - keep your original logic
  rtf = rtf.replace(/(?:^|\n)[ \t]*•[ \t]*(.+)/g, "\n<li>$1</li>");
  rtf = rtf.replace(/(?:^|\n)[ \t]*\d+\.[ \t]*(.+)/g, "\n<li>$1</li>");
  rtf = rtf.replace(/((?:<li>.*?<\/li>\s*){1,})/gs, (match) => `<ul>${match}</ul>`);

  // Remove empty divs
  rtf = rtf.replace(/<div>\s*<\/div>/g, "<div>&nbsp;</div>");
  rtf = rtf.replace(/(<div>&nbsp;<\/div>)+/g, "<div>&nbsp;</div>");
  rtf = rtf.replace(/<\/div><div>/g, "</div>\n<div>");
  rtf = rtf.replace(/\n{2,}/g, "\n");

  // Optionally remove empty divs at the start and end
  rtf = rtf.replace(/^(<div>&nbsp;<\/div>\s*)+/, "");
  rtf = rtf.replace(/(\s*<div>&nbsp;<\/div>)+$/, "");

  return rtf.trim();
}

module.exports = { convertRtfToHtml };