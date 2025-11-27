// const express = require("express");
// const { OpenAI } = require("openai");

// const router = express.Router();
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "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" });

// router.post("/analysis", async (req, res) => {
//   try {
//     const { cropData, location } = req.body;
//     if (!cropData || !location) {
//       return res.status(400).json({ success: false, error: "Missing data" });
//     }

//     const prompt = `
// You are an agricultural expert specializing in Nepali agro-climatic zones.

// Analyze the following data and create TWO outputs:

// ========================================================
// 1) ENGLISH_AI_RESPONSE
// 2) NEPALI_AI_RESPONSE
// ========================================================

// FORMAT:

// ### 🌾 Crop Health Summary
// ### ⚠️ Detected Risks
// ### 🧪 Soil & Nutrient Diagnosis
// ### 💡 Immediate Actions (Next 48 hours)
// ### 📅 7-Day Action Plan
// ### 🌤 Climate-aware Recommendations

// ========================================================

// DATA:
// Location:
// Lat: ${location.lat}
// Lng: ${location.lng}

// CROP:
// Stage: ${cropData.cropStage}
// Days From Germination: ${cropData.daysFromGermination}
// Soil Moisture: ${cropData.soilMoisture}
// Humidity: ${cropData.humidity}%
// pH: ${cropData.ph}
// Phosphorus: ${cropData.phosphorus}
// Nitrogen: ${cropData.nitrogen}
// Organic Content: ${cropData.organicContent}%
// Water Source: ${cropData.waterSource}

// ========================================================

// Respond in EXACT structure with both languages.
// `;

//     const completion = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3,
//     });

//     const full = completion.choices[0].message.content;

//     // Extract English + Nepali blocks
//     const english = full.match(/ENGLISH_AI_RESPONSE([\s\S]*?)NEPALI_AI_RESPONSE/);
//     const nepali = full.match(/NEPALI_AI_RESPONSE([\s\S]*)/);

//     return res.json({
//       success: true,
//       englishSuggestion: english ? english[1].trim() : "English response unavailable",
//       nepaliSuggestion: nepali ? nepali[1].trim() : "Nepali response unavailable",
//     });

//   } catch (error) {
//     console.error("AI ERROR:", error);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// module.exports = router;
// src/routes/cropRoutes.js
const express = require("express");
const { OpenAI } = require("openai");
const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// quick debug helper route (optional)
// router.get("/debug", (req, res) => res.json({ ok: true }));

// router.post("/analysis", async (req, res) => {
//   try {
//     console.log(">>> POST /api/crop/analysis received at", new Date().toISOString());
//     console.log("Headers:", req.headers);
//     // show a short preview of body to avoid huge logs
//     console.log("Body (preview):", JSON.stringify(req.body).slice(0, 2000));

//     // defensive destructure
//     const { cropData, location } = req.body || {};

//     if (!cropData || !location) {
//       return res.status(400).json({
//         success: false,
//         error: "Missing payload. Expected JSON body with { cropData, location }",
//         received: {
//           hasBody: !!req.body,
//           bodyType: typeof req.body,
//         },
//       });
//     }

//     // Build prompt (example - keep your improved prompt here)
//     const prompt = `...` ; // your existing prompt string

//     // call OpenAI (keep this simple for now)
//     const completion = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.3,
//     });

//     const fullText = completion.choices?.[0]?.message?.content ?? "";

//     // parse bilingual blocks with fallback
//     const enMatch = fullText.match(/ENGLISH_AI_RESPONSE\s*([\s\S]*?)\s*NEPALI_AI_RESPONSE/i);
//     const npMatch = fullText.match(/NEPALI_AI_RESPONSE\s*([\s\S]*)/i);

//     const englishSuggestion = enMatch ? enMatch[1].trim() : fullText.trim();
//     const nepaliSuggestion = npMatch ? npMatch[1].trim() : "Nepali response not available";

//     return res.json({ success: true, englishSuggestion, nepaliSuggestion });
//   } catch (err) {
//     console.error("AI ERROR:", err);
//     return res.status(500).json({ success: false, error: "Server error", detail: err.message });
//   }
// });

// inside src/routes/cropRoutes.js - replace the POST /analysis handler with this:

router.post("/analysis", async (req, res) => {
  try {
    console.log(">>> POST /api/crop/analysis received at", new Date().toISOString());
    console.log("Headers:", req.headers);

    // Accept either parsed JSON or stringified JSON (robust)
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
        console.log("Parsed req.body from string payload.");
      } catch (parseErr) {
        return res.status(400).json({
          success: false,
          error: "Invalid JSON body. Set Content-Type: application/json and valid JSON payload.",
        });
      }
    }

    const { cropData, location } = body || {};

    if (!cropData || !location) {
      console.warn("Missing cropData or location in request body:", body);
      return res.status(400).json({
        success: false,
        error: "Missing payload. Expected JSON with { cropData, location }",
      });
    }

    // Build a strong bilingual prompt filled with the user's data
    const prompt = `
You are an experienced agricultural extension officer for South Asia. Based on the provided crop assessment data, produce TWO separate outputs labeled exactly:

ENGLISH_AI_RESPONSE
<English response here>

NEPALI_AI_RESPONSE
<Nepali response here>

Both responses must follow this structure and be farmer-friendly and actionable:

### 🌾 Crop Health Summary
(Brief 2–3 sentence summary of the crop status)

### ⚠️ Detected Risks
(Bullet-list of the most likely risks: pests, disease, nutrient deficiency, waterlogging, drought, etc.)

### 🧪 Soil & Nutrient Diagnosis
(Interpret soil pH, N, P, organic content — tell if correction needed and what)

### 💡 Immediate Actions (Next 48 hours)
(3–6 concrete steps a farmer can take now — e.g., adjust irrigation, apply X kg/ha of Y fertilizer, scout for pests)

### 📅 7-Day Action Plan
(Daily concise plan for the next 7 days — actionable & practical)

### 🌤 Climate-aware Recommendations
(Consider soil moisture, humidity, water source, and location; warn about rain if relevant)

DATA (do not invent data — use exactly what's provided):
Location:
- lat: ${location.lat}
- lng: ${location.lng}
- name: ${location.name || "N/A"}

Crop Data:
- cropStage: ${cropData.cropStage}
- daysFromGermination: ${cropData.daysFromGermination}
- soilMoisture: ${cropData.soilMoisture}
- humidity: ${cropData.humidity}%
- ph: ${cropData.ph}
- phosphorus: ${cropData.phosphorus} mg/kg
- nitrogen: ${cropData.nitrogen} mg/kg
- organicContent: ${cropData.organicContent}%
- waterSource: ${cropData.waterSource}

IMPORTANT:
- Output must include both labeled blocks (ENGLISH_AI_RESPONSE then NEPALI_AI_RESPONSE).
- Use simple language a smallholder farmer can follow.
- For Nepali, use natural Nepali agricultural terms (not literal word-by-word translation).
- Keep each numbered/bullet section concise.

Return only the two labeled blocks and nothing else.
`;

    console.log("Prompt preview:", prompt.slice(0, 1200)); // log start of prompt (avoid huge logs)

    // Call OpenAI (adjust model if you prefer)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",        // or another model you have access to
      messages: [{ role: "user", content: prompt }],
      temperature: 0.15,
      max_tokens: 1200,
    });

    // Log the raw completion object for debugging
    console.log("OpenAI raw completion:", JSON.stringify(completion).slice(0, 2000));

    const fullText = completion.choices?.[0]?.message?.content ?? "";
    console.log("OpenAI fullText (start):", fullText.slice(0, 1000));

    // Parse bilingual blocks robustly (case-insensitive)
    const enMatch = fullText.match(/ENGLISH_AI_RESPONSE\s*([\s\S]*?)\s*NEPALI_AI_RESPONSE/i);
    const npMatch = fullText.match(/NEPALI_AI_RESPONSE\s*([\s\S]*)/i);

    // Fallback: if model didn't include markers, try to split by double newline or return full text as English
    const englishSuggestion = enMatch ? enMatch[1].trim() : (fullText.length ? fullText.trim() : "English response not available");
    const nepaliSuggestion = npMatch ? npMatch[1].trim() : "Nepali response not available";

    // Final sanity: ensure englishSuggestion is not the same as the generic short fallback
    if (englishSuggestion.length < 20) {
      console.warn("English suggestion is unexpectedly short; returning full model output as fallback.");
    }

    return res.json({
      success: true,
      englishSuggestion,
      nepaliSuggestion,
      debug: { model: completion.model || null }, // optional small debug info
    });
  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error", detail: err.message });
  }
});


module.exports = router;