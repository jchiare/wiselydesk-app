export class AgentRequest {
  botId: number;
  text?: string;
  userRequestAgent = [
    "agent",
    "wdtest agent",
    "live chat",
    "connect me to an agent",
    "talk to support",
    "support"
  ];

  constructor({ botId }: { botId: number }) {
    this.botId = botId;
  }

  requestingAgent(text: string): boolean {
    this.text = text.trim().toLowerCase();
    return this.userRequestAgent.includes(this.text);
  }

  getResponse(): string {
    if (this.botId === 3) {
      return "AMBOSS Support is online from Monday to Friday between 9am and 5pm EST. You can create a support ticket here to get an answer later or chat with me and I will do my best to help you with your request. <button create> Create Support Ticket</button create>";
    } else if (this.botId === 4) {
      return "Der AMBOSS Support ist von Montag bis Freitag zwischen 9-17 Uhr online. Du kannst hier ein Support-Ticket erstellen, um später eine Antwort zu erhalten oder mit mir chatten und ich werde mein Bestes tun, um dich bei deinem Anliegen zu unterstützen.  <button create> Support-Ticket erstellen</button create>";
    } else if (this.botId === 1) {
      return "WiselyDesk testing agent <button create> Create Support Ticket</button create>";
    }
    throw new Error(`Bot ${this.botId} does not have a generic agent message`);
  }
}
