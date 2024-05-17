// from the message
export function removeSupportButton(text: string): [string, boolean] {
  const supportTicketRegex = /<button\s+create.*>(.*?)(<\/button\s+create>|$)/g;
  let foundSupportTicketRegex = false;

  text = text.replace(supportTicketRegex, match => {
    foundSupportTicketRegex = true;
    return "";
  });

  return [text, foundSupportTicketRegex];
}

// Changes [url title](url) to a proper A html element
export function formatMarkdownLinks(text: string): string {
  const markdownLinksRegex = /\[([^\]]+)\]\(([^)]+)\)/g; // Expect markdown links to be in the form [text](url)

  // Format links
  text = text.replace(markdownLinksRegex, (_, p1, p2) => {
    // p1: link text, p2: link URL
    if (["1", "2", "3", "4"].includes(p1)) {
      // If the link text is a number, we expect it to be a source, so make it a superscript
      return `<sup><a rel="noopener noreferrer" target="_blank" style="text-decoration:none;" href="${p2}"> ${p1}</a></sup>`;
    }
    return `<a style="text-decoration:underline;" rel="noopener noreferrer" target="_blank" href="${p2}">${p1}</a>`;
  });

  // const partialMarkdownLinksRegex = /\[(\w+)\](?!(\(([^)]+)\)))/g;
  const partialMarkdownLinksRegex = /\[([^\]]+)\]\(([^)]+)/g;
  text = text.replace(partialMarkdownLinksRegex, (_, p1) => {
    // Assuming partial links should also differentiate between numeric and text links
    if (["1", "2", "3", "4"].includes(p1)) {
      return `<sup><a rel="noopener noreferrer" target="_blank" style="text-decoration:none;"> ${p1}</a></sup>`;
    }
    return `<a style="text-decoration:underline;" rel="noopener noreferrer" target="_blank">${p1}</a>`;
  });

  return text;
}

function markdownToHtml(markdown: string): string {
  // Convert headings and apply TailwindCSS classes
  const headingRegex = /^(#{1,6})\s+(.*)$/gm;
  markdown = markdown.replace(headingRegex, (_, hashes, content) => {
    const level = hashes.length;
    let tailwindClass = "";
    switch (level) {
      case 1:
        tailwindClass = "text-4xl font-bold text-gray-900";
        break;
      case 2:
        tailwindClass = "text-3xl font-semibold text-gray-800";
        break;
      case 3:
        tailwindClass = "text-2xl font-medium text-gray-700";
        break;
      default:
        tailwindClass = "text-xl font-medium text-gray-600"; // Generic style for h4-h6
    }
    return `<h${level} class="${tailwindClass}">${content}</h${level}>`;
  });

  // Convert bold text
  const boldRegex = /\*\*(.*?)\*\*/g;
  markdown = markdown.replace(boldRegex, "<strong>$1</strong>");

  // Convert italic text
  const italicRegex = /\*(.*?)\*/g;
  markdown = markdown.replace(italicRegex, "<em>$1</em>");

  return markdown;
}
export default function renderMessage(text: string | null) {
  if (!text) return text;
  [text] = removeSupportButton(text);
  text = formatMarkdownLinks(text);

  text = markdownToHtml(text);

  return text;
}
