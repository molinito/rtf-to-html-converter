function convertRtfToHtml(rtf) {
  if (!rtf || typeof rtf !== "string") return "";

  // Reemplaza los caracteres Unicode
  rtf = rtf.replace(/\\u(-?\d+)(.)/g, (_, code, fallback) => {
    const num = parseInt(code, 10);
    if (num >= 0 && num <= 65535) {
      return String.fromCharCode(num);
    } else if (num < 0) {
      return String.fromCodePoint(65536 + num);
    } else {
      return String.fromCodePoint(num);
    }
  });

  // Negrita, cursiva y subrayado
  rtf = rtf
    .replace(/\\b\s?(.*?)\\b0/g, "<strong>$1</strong>")
    .replace(/\\i\s?(.*?)\\i0/g, "<em>$1</em>")
    .replace(/\\ul\s?(.*?)\\ulnone/g, "<u>$1</u>");

  // Listas con viñetas (bullet)
  rtf = rtf.replace(/\\pard[^{]*?\\bullet\s?(.*?)\\par/g, "<li>$1</li>");
  // Listas numeradas simples
  rtf = rtf.replace(/\\pard[^{]*?\\ls\d+\s*\\ilvl\d+\s?(.*?)\\par/g, "<li>$1</li>");
  // Agrupa <li> en <ul>
  rtf = rtf.replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>");
  // Evita múltiples <ul> anidados
  rtf = rtf.replace(/<\/ul>\s*<ul>/g, "");

  // Tablas simples
  rtf = rtf.replace(/\\trowd([\s\S]*?)\\row/g, (match, cells) => {
    // Cada celda termina con \cell
    const tds = cells.split(/\\cell/).filter(Boolean).map(cell =>
      `<td>${cell.replace(/\\[a-z]+\d* ?/g, "").trim()}</td>`
    ).join("");
    return `<tr>${tds}</tr>`;
  });
  // Agrupa <tr> en <table>
  rtf = rtf.replace(/(<tr>[\s\S]*?<\/tr>)/g, "<table>$1</table>");
  rtf = rtf.replace(/<\/table>\s*<table>/g, "");

  // Saltos de párrafo y línea
  rtf = rtf
    .replace(/\\par/g, "<br>")
    .replace(/\\line/g, "<br>")
    .replace(/\\'([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  // Limpia comandos RTF restantes y llaves
  rtf = rtf.replace(/\\[a-z]+\d* ?/g, "");
  rtf = rtf.replace(/[{}]/g, "");

  // Limpia espacios extra
  rtf = rtf.replace(/<br>\s*<br>/g, "<br>");

  return `<p>${rtf.trim()}</p>`;
}

module.exports = { convertRtfToHtml };