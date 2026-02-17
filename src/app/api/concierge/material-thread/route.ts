import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  MATERIAL_EXPLORE_SYSTEM_PROMPT,
  MaterialAlternative,
} from "@/lib/concierge-data";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { material, enquirySummary, messages } = (await request.json()) as {
      material: MaterialAlternative;
      enquirySummary: string;
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!material || !messages) {
      return NextResponse.json(
        { error: "material and messages are required" },
        { status: 400 }
      );
    }

    const materialContext = `## Material Being Evaluated

**Primary Material (from RFQ):** ${material.primaryMaterial}
**Alternative Under Review:** ${material.alternativeGrade}
**Compatibility:** ${material.compatibility}
**Cost Delta:** ${material.costDelta}
**Our Available Stock:** ${material.availableStock}
**Notes:** ${material.notes}
**Customer Approval Required:** ${material.requiresApproval ? "Yes" : "No"}

## RFQ Context
${enquirySummary}`;

    const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: MATERIAL_EXPLORE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Here is the material alternative I want to explore:\n\n${materialContext}`,
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
    console.error("Material thread API error:", error);

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
