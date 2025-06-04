function convertRtfToHtml(rtf) {
  if (!rtf || typeof rtf !== "string") return "";

  // Elimina la tabla de fuentes y color para que no aparezcan como texto
  rtf = rtf.replace(/\\fonttbl[\s\S]+?;}/g, "");
  rtf = rtf.replace(/\\colortbl[\s\S]+?;}/g, "");

  // Decodifica caracteres Unicode (\uXXXX?)
  rtf = rtf.replace(/\\u(-?\d+)\??/g, (_, code) => {
    const num = parseInt(code, 10);
    return String.fromCharCode(num < 0 ? 65536 + num : num);
  });

  // Decodifica caracteres hexadecimales (\’e1)
  rtf = rtf.replace(/\\'([0-9a-f]{2})/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  // Negrita, cursiva, subrayado (soporta anidados)
  rtf = rtf
    .replace(/\\b\s?(.*?)\\b0/g, "<strong>$1</strong>")
    .replace(/\\i\s?(.*?)\\i0/g, "<em>$1</em>")
    .replace(/\\ul\s?(.*?)\\ulnone/g, "<u>$1</u>");

  // Color básico: rojo y azul (puedes agregar más si lo necesitas)
  rtf = rtf.replace(/\\cf1\s?(.*?)\\cf0/g, '<span style="color: red;">$1</span>');
  rtf = rtf.replace(/\\cf2\s?(.*?)\\cf0/g, '<span style="color: blue;">$1</span>');

  // Bullets: convierte líneas que empiezan con ● o \u9679? en <p>● ...</p>
  rtf = rtf.replace(/(?:\\par)?\s*●\s*([^\r\n<]+)/g, '<p>● $1</p>');
  rtf = rtf.replace(/(?:\\par)?\s*\\u9679\?\s*([^\r\n<]+)/g, '<p>● $1</p>');

  // Saltos de párrafo: convierte \par en </p><p>
  rtf = rtf.replace(/\\par\s*/g, "</p><p>");

  // Quita comandos RTF y llaves restantes
  rtf = rtf.replace(/\\[a-z]+\d* ?/g, "");
  rtf = rtf.replace(/[{}]/g, "");

  // Quita líneas vacías y espacios extra
  rtf = rtf.replace(/<p>\s*<\/p>/g, "");
  rtf = rtf.replace(/^\s+|\s+$/g, "");

  // Asegura que el texto esté envuelto en <p>
  if (!/^<p>/.test(rtf)) rtf = `<p>${rtf}`;
  if (!/<\/p>$/.test(rtf)) rtf = `${rtf}</p>`;

  // Limpia múltiples <p> consecutivos
  rtf = rtf.replace(/<\/p>\s*<p>/g, "</p><p>");

  return rtf;
}

module.exports = { convertRtfToHtml };