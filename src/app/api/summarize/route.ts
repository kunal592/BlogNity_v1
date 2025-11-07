
import { NextResponse } from "next/server";
import { aiSummarizeBlog } from "@/ai/flows/ai-summarize-blog";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const { summary } = await aiSummarizeBlog({ blogContent: content });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Failed to generate summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
