import { streamText, Message } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { initiaMessage } from "@/lib/doc_data";


const googleGenAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

export const runtime = "edge";
const generateId = () => Math.random().toString(36).substring(7);

const buildGoogleGenAIPrompt = async (messages: Message[]): Message[] => [
  {
    id: generateId(),
    role: "user",
    content: initiaMessage.content,
  },
  ...messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
  })),
];

export async function POST(req: Request, res: Response) {
  const { messages } = await req.json();

  const streamm = await streamText({
    model: googleGenAI("gemini-pro"),
    messages: await buildGoogleGenAIPrompt(messages),
    temperature: 0.5,
  });
  return streamm?.toDataStreamResponse();
}
