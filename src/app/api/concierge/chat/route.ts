import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { CONCIERGE_SYSTEM_PROMPT, mockEnquiries, Enquiry } from "@/lib/concierge-data";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { enquiryId, enquiry: inlineEnquiry, messages } = await request.json();

    if (!enquiryId || !messages) {
      return NextResponse.json(
        { error: "enquiryId and messages are required" },
        { status: 400 }
      );
    }

    // Look up from mock data first, fall back to inline enquiry object
    const enquiry: Enquiry | undefined =
      mockEnquiries.find((r) => r.id === enquiryId) || inlineEnquiry;
    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    // Build the enquiry context to inject into the conversation
    const enquiryContext = buildEnquiryContext(enquiry);

    // Build the OpenAI messages array
    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: CONCIERGE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Here is the incoming RFQ to analyze:\n\n${enquiryContext}`,
        },
        // Map the conversation messages (skip the "enquiry" role messages since we injected context above)
        ...messages
          .filter((m: { role: string }) => m.role !== "enquiry")
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

function buildEnquiryContext(enquiry: Enquiry): string {
  let context = `## RFQ: ${enquiry.title}
**Account**: ${enquiry.accountName}
**Contact**: ${enquiry.contactName} (${enquiry.contactEmail})
**Deal**: ${enquiry.dealTitle}
**Estimated Value**: ${enquiry.dealValue}

### Description
${enquiry.description}
`;

  if (enquiry.attachments.length > 0) {
    context += "\n### Attachments\n";
    for (const att of enquiry.attachments) {
      context += `\n**${att.name}** (${att.type}):\n${att.content}\n`;
    }
  }

  return context;
}
