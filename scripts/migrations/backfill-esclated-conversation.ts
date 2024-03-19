import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Specify the path to your .env.local file
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function backfillEscalatedConversations() {
  // Fetch all conversations (Consider batching if you have a large number of conversations)
  const conversations = await prisma.conversation.findMany();

  for (const conversation of conversations) {
    console.log("Processing conversation", conversation.id);
    // Check if an escalation exists for the conversation
    const escalation = await prisma.escalation.findFirst({
      where: { conversation_id: conversation.id }
    });

    // If an escalation exists, update the conversation's 'escalated' field to true
    if (escalation) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { escalated: true }
      });
      console.log(`Updated conversation ${conversation.id} to escalated`);
    }
  }

  console.log("Completed backfilling escalated conversations.");
}

backfillEscalatedConversations()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
