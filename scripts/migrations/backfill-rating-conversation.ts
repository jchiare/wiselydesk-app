import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function backfillConversationRatings() {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ is_helpful: true }, { is_helpful: false }]
    },
    select: { conversation_id: true, is_helpful: true }
  });

  for (const message of messages) {
    console.log("Processing convo ID", message.conversation_id);
    if (message.conversation_id == 35) {
      continue;
    }

    // Update the conversation's rating based on the message's helpfulness
    await prisma.conversation.update({
      where: { id: message.conversation_id },
      data: { rating: message.is_helpful }
    });

    console.log(
      `Updated conversation ${message.conversation_id} with rating: ${message.is_helpful}`
    );
  }

  console.log("Completed backfilling conversation ratings.");
}

backfillConversationRatings()
  .catch(e => {
    console.error("Error during backfill:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
