import { parseArgs } from "node:util";
import { ZendeskKbaClient } from "./wiselydesk/services/kba_importer/zendesk";

// Define the options the script expects
const options = {
  botId: {
    type: "string", // Change the type to an array of strings
    short: "b",
    default: undefined
  }
} as const;

// Parse the command-line arguments
const { values } = parseArgs({ options });

const { botId } = values;

if (!botId) {
  console.error("Bot ID argument is required.");
  process.exit(1);
}
// Validate and convert botId to a number
const validBotId = parseInt(botId, 10);
if (isNaN(validBotId)) {
  console.error("Bot ID must be a number.");
  process.exit(1);
}

// Use the parsed and validated botId
const zendeskKbaClient = new ZendeskKbaClient(validBotId);
zendeskKbaClient.import_all_kbas();
