import OpenAI from "openai";

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
1. The start_position and end_position MUST correspond to the exact position of entity_text in the input.
2. If an entity could belong to multiple types, choose the most specific one.
3. Do not fabricate entities — only extract what is present in the text.
4. Return an empty array if no entities are found.

Respond ONLY with a JSON object in this format:
{ "entities": [ { "entity_text": "...", "entity_type": "...", "start_position": 0, "end_position": 0, "confidence": 0.0 } ] }`;

const sampleText = `Patient is a 55-year-old female presenting with persistent chest pain radiating to the left arm for the past 3 days. She reports shortness of breath and intermittent dizziness. Past medical history includes hypertension and Type 2 diabetes mellitus. Current medications include Metformin 500 mg twice daily, Lisinopril 10 mg once daily, and Aspirin 81 mg daily. Blood pressure measured at 150/95 mmHg. Heart rate 88 bpm. ECG shows ST-segment elevation in leads II, III, and aVF. Troponin I level elevated at 2.5 ng/mL. Plan: Start Heparin drip, schedule cardiac catheterization, and consult cardiology.`;

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY not set");
    process.exit(1);
  }

  console.log("--- Testing entity extraction with GPT-4o-mini ---\n");
  console.log("Input text:", sampleText.substring(0, 100) + "...\n");

  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: sampleText },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    console.log("No content returned from OpenAI");
    return;
  }

  const parsed = JSON.parse(content);
  const entities = parsed.entities ?? [];

  // Post-process
  const cleaned = entities
    .map((e) => ({
      ...e,
      start_position: Math.max(0, Math.min(e.start_position, sampleText.length)),
      end_position: Math.max(0, Math.min(e.end_position, sampleText.length)),
      confidence: Math.max(0, Math.min(1, e.confidence)),
    }))
    .filter((e) => e.start_position < e.end_position);

  console.log(`Extracted ${cleaned.length} entities:\n`);

  // Group by type
  const grouped = {};
  for (const entity of cleaned) {
    if (!grouped[entity.entity_type]) grouped[entity.entity_type] = [];
    grouped[entity.entity_type].push(entity);
  }

  for (const [type, ents] of Object.entries(grouped)) {
    console.log(`  ${type}:`);
    for (const e of ents) {
      const actual = sampleText.substring(e.start_position, e.end_position);
      const match = actual === e.entity_text ? "OK" : `MISMATCH (actual: "${actual}")`;
      console.log(`    - "${e.entity_text}" [${e.start_position}:${e.end_position}] confidence=${e.confidence} position=${match}`);
    }
  }

  console.log("\nTest complete.");
}

main();
