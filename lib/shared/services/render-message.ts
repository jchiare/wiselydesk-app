// removes the HTML text <button create> </button create>
// from the message
export function removeSupportButton(text: string): [string, boolean] {
  const supportTicketRegex = /<button\s+create.*>(.*?)<\/button(\s+create>)?/g;
  let foundSupportTicketRegex = false;

  console.log("Original text:", text); // Debug: Log the original text

  text = text.replace(supportTicketRegex, (match) => {
    foundSupportTicketRegex = true;
    console.log("Match found:", match); // Debug: Log the match

    return "";
  });

  console.log("Modified text:", text); // Debug: Log the modified text
  console.log("Regex found:", foundSupportTicketRegex); // Debug: Log the regex found status

  return [text, foundSupportTicketRegex];
}

// Changes [url title](url) to a proper A html element
function formatMarkdownLinks(text: string): string {
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

  return text;
}

export default function renderMessage(text: string | null) {
  if (!text) return text;
  text = text.replaceAll("<NEWLINE>", "<br>");
  [text] = removeSupportButton(text);
  text = formatMarkdownLinks(text);

  return text;
}
