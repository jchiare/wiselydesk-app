const http = require("http");

const AI_EN_RESPONSE =
  "As a virtual assistant, I don't have access to personal data unless it has been shared with me in the course of our conversation. I'm designed to respect user privacy and confidentiality. Therefore, I'm unable to check the status of your payment. However, you can check the status of your payment by logging into your AMBOSS account and navigating to the Account > Payment info & Invoices section. If you're still unsure, please reach out to AMBOSS support for further assistance.";

const server = http.createServer((req, res) => {
  // Send text
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Connection: "keep-alive"
  });
  res.write(`data: ${JSON.stringify({ text: AI_EN_RESPONSE })} \n\n`);

  req.on("close", () => res.end("OK"));
  // close the connection after a second
  setTimeout(() => {
    res.write(
      'event: closing_connection\ndata: {"sender": "admin", "finished": true, "sources": ["https://support.amboss.com/hc/en-us/articles/360045123951-How-can-I-become-an-AMBOSS-member-"], "conversation_id": 1234, "message_id": 123} \n\n'
    );
    res.end("OK");
  }, 1000);
});

const PORT = 5000;
server.listen(5000, "localhost", () =>
  console.log(`Started E2E backend server on port ${PORT}`)
);

// server.listen(3000, "0.0.0.0", () =>
//   console.log("Started E2E backend server on port 3000")
// );
