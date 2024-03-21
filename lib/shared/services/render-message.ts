// removes the HTML text <button create> </button create>
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

  const partialMarkdownLinksRegex = /\[(\w+)\](?!(\(([^)]+)\)))/g;
  const [urlTitleArr] = [...text.matchAll(partialMarkdownLinksRegex)];

  const urlTitle = urlTitleArr?.[0]?.[1];
  const matchSection = urlTitleArr?.[0]?.[0];

  if (urlTitle) {
    const insertLink = `<sup><a rel="noopener noreferrer" target="_blank" style="text-decoration:none;""> ${urlTitle}</a></sup>`;
    text = text.replaceAll(matchSection, insertLink);
    if (urlTitleArr.index) {
      text = text.slice(0, urlTitleArr.index + insertLink.length);
    }
  }

  return text;
}

export default function renderMessage(text: string | null) {
  console.log("text ... ", text);
  if (!text) return text;
  [text] = removeSupportButton(text);
  text = formatMarkdownLinks(text);
  console.log("text: ", text);

  return text;
}
