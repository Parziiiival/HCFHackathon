const BASE_URL = "http://localhost:3000";

const sampleText = `
Patient is a 55-year-old female presenting with persistent chest pain radiating to the left arm 
for the past 3 days. She reports shortness of breath and intermittent dizziness. 
Past medical history includes hypertension and Type 2 diabetes mellitus. 
Current medications include Metformin 500 mg twice daily, Lisinopril 10 mg once daily, 
and Aspirin 81 mg daily. Blood pressure measured at 150/95 mmHg. 
Heart rate 88 bpm. ECG shows ST-segment elevation in leads II, III, and aVF. 
Troponin I level elevated at 2.5 ng/mL. Plan: Start Heparin drip, 
schedule cardiac catheterization, and consult cardiology.
`.trim();

async function testExtractEntities() {
  console.log("--- Testing POST /api/extract-entities ---\n");
  console.log("Input text:", sampleText.substring(0, 100) + "...\n");

  const res = await fetch(`${BASE_URL}/api/extract-entities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: sampleText }),
  });

  console.log("Status:", res.status);

  const data = await res.json();

  if (data.entities) {
    console.log(`\nExtracted ${data.entities.length} entities:\n`);

    const grouped = {};
    for (const entity of data.entities) {
      if (!grouped[entity.entity_type]) grouped[entity.entity_type] = [];
      grouped[entity.entity_type].push(entity);
    }

    for (const [type, entities] of Object.entries(grouped)) {
      console.log(`  ${type}:`);
      for (const e of entities) {
        console.log(`    - "${e.entity_text}" (confidence: ${e.confidence})`);
      }
    }
  } else {
    console.log("Response:", JSON.stringify(data, null, 2));
  }
}

async function testValidation() {
  console.log("\n\n--- Testing validation (empty text) ---\n");

  const res = await fetch(`${BASE_URL}/api/extract-entities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "" }),
  });

  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Response:", JSON.stringify(data, null, 2));
}

async function main() {
  try {
    await testExtractEntities();
    await testValidation();
    console.log("\n\nAll tests complete.");
  } catch (err) {
    console.error("Test failed:", err.message);
  }
}

main();
