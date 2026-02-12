import { NextResponse } from "next/server"
import OpenAI from "openai"

const ALLOWED_TYPES = new Set([
  "audio/mpeg",       // mp3
  "audio/mp4",        // mp4 / m4a
  "audio/mp3",
  "audio/mpga",
  "audio/m4a",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/webm",
  "audio/ogg",
  "video/mp4",
  "video/webm",
])

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB — Whisper's limit

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing OPENAI_API_KEY" },
        { status: 500 }
      )
    }

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing required 'file' field. Upload an audio file." },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 25 MB, got ${(file.size / 1024 / 1024).toFixed(1)} MB.` },
        { status: 400 }
      )
    }

    // Validate MIME type (lenient — also allow octet-stream for some uploaders)
    if (file.type && file.type !== "application/octet-stream" && !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type '${file.type}'. Supported: mp3, mp4, mpeg, mpga, m4a, wav, webm, ogg.` },
        { status: 400 }
      )
    }

    // Optional parameters
    const language = formData.get("language") as string | null
    const prompt = formData.get("prompt") as string | null

    // Call OpenAI Whisper API
    const openai = new OpenAI({ apiKey })

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file,
      ...(language ? { language } : {}),
      ...(prompt ? { prompt } : {}),
    })

    return NextResponse.json({ text: transcription.text })
  } catch (err: unknown) {
    // Surface OpenAI-specific errors
    if (err instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${err.message}` },
        { status: err.status ?? 500 }
      )
    }

    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
