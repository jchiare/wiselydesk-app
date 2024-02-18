import { parseArgs } from "node:util";
import { ZendeskKbaImporter } from "@/lib/shared/services/zendesk/kba-import";

const options = {
  botId: {
    type: "string",
    short: "b",
    default: undefined
  }
} as const;

const { values } = parseArgs({ options });

const { botId } = values;

if (!botId) {
  console.error("Bot ID argument is required.");
  process.exit(1);
}

const zendeskKbaClient = new ZendeskKbaImporter(botId);
zendeskKbaClient.importAllKbas();
