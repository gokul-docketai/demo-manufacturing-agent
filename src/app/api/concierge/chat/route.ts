import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { CONCIERGE_SYSTEM_PROMPT, mockRFQs } from "@/lib/concierge-data";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { rfqId, messages } = await request.json();

    if (!rfqId || !messages) {
      return NextResponse.json(
        { error: "rfqId and messages are required" },
        { status: 400 }
      );
    }

    const rfq = mockRFQs.find((r) => r.id === rfqId);
    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    // Build the RFQ context to inject into the conversation
    const rfqContext = buildRFQContext(rfq);

    // Build the OpenAI messages array
    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: CONCIERGE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Here is the incoming RFQ to analyze:\n\n${rfqContext}`,
        },
        // Map the conversation messages (skip the "rfq" role messages since we injected context above)
        ...messages
          .filter((m: { role: string }) => m.role !== "rfq")
          .map((m: { role: string; content: string }) => ({
            role: m.role === "agent" ? ("assistant" as const) : ("user" as const),
            content: m.content,
          })),
      ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: openaiMessages,
    });

    const responseContent =
      completion.choices[0]?.message?.content ||
      "I apologize, but I was unable to generate a response. Please try again.";

    return NextResponse.json({ content: responseContent });
  } catch (error) {
    console.error("Concierge chat API error:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildRFQContext(rfq: (typeof mockRFQs)[number]): string {
  let context = `## RFQ: ${rfq.title}
**Account**: ${rfq.accountName}
**Contact**: ${rfq.contactName} (${rfq.contactEmail})
**Deal**: ${rfq.dealTitle}
**Estimated Value**: ${rfq.dealValue}

### Description
${rfq.description}
`;

  if (rfq.attachments.length > 0) {
    context += "\n### Attachments\n";
    for (const att of rfq.attachments) {
      context += `\n**${att.name}** (${att.type}):\n${att.content}\n`;
    }
  }

  return context;
}
