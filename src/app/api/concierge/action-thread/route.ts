import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  ACTION_AGENT_SYSTEM_PROMPT,
  RecommendedAction,
} from "@/lib/concierge-data";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { action, enquirySummary, messages } = (await request.json()) as {
      action: RecommendedAction;
      enquirySummary: string;
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!action || !messages) {
      return NextResponse.json(
        { error: "action and messages are required" },
        { status: 400 }
      );
    }

    const actionContext = `## Action Being Verified

**Title:** ${action.title}
**Description:** ${action.description}
**Category:** ${action.category}
**Priority:** ${action.priority}

## RFQ Context
${enquirySummary}`;

    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: ACTION_AGENT_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Here is the recommended action I want to verify and execute:\n\n${actionContext}`,
        },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
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
    console.error("Action thread API error:", error);

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
