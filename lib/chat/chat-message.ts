type ChatMessageParams = {
  text: string;
  sender: "user" | "assistant";
};

export default class ChatMessage {
  public text: string;
  public sender: "user" | "assistant";

  constructor({ text, sender }: ChatMessageParams) {
    this.text = text;
    this.sender = sender;
  }
}
