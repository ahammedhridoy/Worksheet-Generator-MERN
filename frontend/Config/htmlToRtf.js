export function htmlToRtfFunction(html) {
  const processedHtml = html
    .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
    .replace(/&#(\d+);/g, (match, charCode) => String.fromCharCode(charCode)); // Decode HTML entities

  // Replace specific HTML tags with their RTF equivalents
  const rtf = processedHtml
    .replace(/<b>/g, "{\\b ") // Bold start tag
    .replace(/<\/b>/g, "\\b0}") // Bold end tag
    .replace(/<br\s*\/?>/g, "\\n ") // Replace `<br>` with RTF line break
    .replace(/\n/g, "\n") // Keep newlines (important for line breaks)
    .replace(/<[^>]+>/g, "") // Remove all other HTML tags
    .replace(/\t/g, "\\tab "); // Replace tabs with RTF tab

  return rtf;
}
