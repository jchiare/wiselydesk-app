import OpenAI from "openai";

const openai = new OpenAI({ maxRetries: 2, timeout: 30 * 1000 });

export default openai;
