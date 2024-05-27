// export function htmlToRtfFunction(html) {
//   const processedHtml = html
//     .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
//     .replace(/&#(\d+);/g, (match, charCode) => String.fromCharCode(charCode)); // Decode HTML entities

//   // Replace specific HTML tags with their RTF equivalents
//   const rtf = processedHtml
//     .replace(/<b>/g, "{\\b ") // Bold start tag
//     .replace(/<\/b>/g, "\\b0}") // Bold end tag
//     .replace(/<p>/g, "\n") // Paragraph start tag
//     .replace(/<\/p>/g, "\n") // Paragraph end tag
//     .replace(/<blockquote>/g, "\n") // blockquote start tag
//     .replace(/<\/blockquote>/g, "\n") // blockquote end tag
//     .replace(/<h1>/g, "\n") // h1 start tag
//     .replace(/<\/h1>/g, "\n") // h1 end tag
//     .replace(/<h2>/g, "\n") // h2 start tag
//     .replace(/<\/h2>/g, "\n") // h2 end tag
//     .replace(/<h3>/g, "\n") // h3 start tag
//     .replace(/<\/h3>/g, "\n") // h3 end tag
//     .replace(/<h4>/g, "\n") // h4 start tag
//     .replace(/<\/h4>/g, "\n") // h4 end tag
//     .replace(/<h4>/g, "\n") // h4 start tag
//     .replace(/<\/h4>/g, "\n") // h4 end tag
//     .replace(/<h5>/g, "\n") // h5 start tag
//     .replace(/<\/h5>/g, "\n") // h5 end tag
//     .replace(/<h6>/g, "\n") // h6 start tag
//     .replace(/<\/h6>/g, "\n") // h6 end tag
//     .replace(/<br\s*\/?>/g, "\n") // Replace <br> with RTF line break
//     .replace(/<li[^>]*>(.*?)<\/li>/g, (match, content) => {
//       return `\n• ${content.trim()}\n`; // List item tag with a line break
//     })
//     .replace(/\n\s*\n/g, "\n") // Replace multiple consecutive newlines with a single newline
//     .replace(/<[^>]+>/g, ""); // Remove all other HTML tags

//   return rtf;
// }
