import OpenAI from "openai"

// ── Entity types (full medical set) ──────────────────────────────────────────

export type EntityType =
  | "MEDICATION"
  | "SYMPTOM"
  | "DIAGNOSIS"
  | "PROCEDURE"
  | "ANATOMY"
  | "LAB_VALUE"
  | "DOSAGE"
  | "FREQUENCY"
  | "DEMOGRAPHIC"

export interface ExtractedEntity {
  entity_text: string
  entity_type: EntityType
  start_position: number
  end_position: number
  confidence: number
}

// ── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a clinical NLP entity extraction system. Given a clinical text, extract all healthcare-related entities.

For each entity found, return a JSON object with:
- "entity_text": the exact substring from the input text
- "entity_type": one of MEDICATION, SYMPTOM, DIAGNOSIS, PROCEDURE, ANATOMY, LAB_VALUE, DOSAGE, FREQUENCY, DEMOGRAPHIC
- "start_position": the 0-based character index where the entity starts in the input text
- "end_position": the 0-based character index where the entity ends (exclusive) in the input text
- "confidence": a number between 0 and 1 indicating your confidence

Entity type definitions:
- MEDICATION: drug names (brand or generic), e.g. "aspirin", "Lipitor"
- SYMPTOM: patient-reported symptoms, e.g. "headache", "nausea", "chest pain"
- DIAGNOSIS: clinical diagnoses or conditions, e.g. "hypertension", "type 2 diabetes"
- PROCEDURE: medical procedures, surgeries, or tests, e.g. "MRI", "appendectomy", "blood draw"
- ANATOMY: body parts or organ systems, e.g. "left knee", "liver", "lungs"
- LAB_VALUE: lab results with values/units, e.g. "hemoglobin 12.5 g/dL", "glucose 110 mg/dL"
- DOSAGE: drug dosages or amounts, e.g. "500 mg", "10 units"
- FREQUENCY: timing or schedules, e.g. "twice daily", "every 8 hours", "once a week"
- DEMOGRAPHIC: patient demographics, e.g. "45-year-old male", "82 kg"

Rules:
1. The start_position and end_position MUST correspond to the exact position of entity_text in the input. Verify the substring matches.
2. If an entity could belong to multiple types, choose the most specific one.
3. Do not fabricate entities — only extract what is present in the text.
4. Return an empty array if no entities are found.

Respond ONLY with a JSON object in this format:
{ "entities": [ { "entity_text": "...", "entity_type": "...", "start_position": 0, "end_position": 0, "confidence": 0.0 } ] }`

// ── Main extraction function ─────────────────────────────────────────────────

export async function extractEntities(text: string): Promise<ExtractedEntity[]> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable")
  }

  const openai = new OpenAI({ apiKey })

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: text },
    ],
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    return []
  }

  const parsed = JSON.parse(content) as { entities?: ExtractedEntity[] }
  const entities = parsed.entities ?? []

  // Post-process: validate positions against the original text
  return entities
    .map((entity) => ({
      ...entity,
      // Clamp positions to valid range
      start_position: Math.max(0, Math.min(entity.start_position, text.length)),
      end_position: Math.max(0, Math.min(entity.end_position, text.length)),
      // Clamp confidence to 0-1
      confidence: Math.max(0, Math.min(1, entity.confidence)),
    }))
    .filter((entity) => entity.start_position < entity.end_position)
}
