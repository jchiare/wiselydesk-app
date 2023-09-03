type ChatMessageParams = {
  text: string;
  sender: "user" | "assistant";
  sentTime?: string;
};

export default class ChatMessage {
  public text: string;
  public sender: "user" | "assistant";
  public sentTime?: string;

  constructor({ text, sender, sentTime }: ChatMessageParams) {
    this.text = text;
    this.sender = sender;
    this.sentTime = sentTime;
  }

  static createSentTimeField(): string {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
