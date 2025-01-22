import { streamText } from "ai";
import { initiaMessage } from "@/lib/doc_data";
import { createOpenAI } from "@ai-sdk/openai";

const openAI = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    compatibility: "strict",
});
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await streamText({
    model: openAI("gpt-4o-mini"),
    messages:[initiaMessage, ...messages],
    temperature: 1,
  });
  
  return stream?.toDataStreamResponse();
}
