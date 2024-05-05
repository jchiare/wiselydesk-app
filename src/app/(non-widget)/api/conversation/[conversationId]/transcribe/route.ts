import { TranscriptionService } from "@/lib/chat/conversation/transcription";

type Params = {
  params: { conversationId: string };
};

export async function GET(request: Request, { params }: Params) {
  const { conversationId } = params;

  const transriptionService = new TranscriptionService(conversationId);
  const transcription = await transriptionService.transcribe();

  return Response.json({ transcription }, { status: 200 });
}
