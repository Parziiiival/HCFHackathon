import { NextResponse } from "next/server"
import OpenAI from "openai"
import { extractEntities } from "@/lib/extract-entities"

const MAX_TEXT_LENGTH = 50_000 // ~50k characters

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body as { text?: string }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'text' field in request body." },
        { status: 400 }
      )
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Text too long. Maximum length is ${MAX_TEXT_LENGTH} characters, got ${text.length}.`,
        },
        { status: 400 }
      )
    }

    const entities = await extractEntities(text)

    return NextResponse.json({ entities })
  } catch (err: unknown) {
    if (err instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${err.message}` },
        { status: err.status ?? 500 }
      )
    }

    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      )
    }

    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
