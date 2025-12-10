import Groq from "groq-sdk";
import axios from "axios";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

async function fetchPronunciation(word) {
  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
      )}`
    );

    const entry = response.data[0];
    const phonetics = entry.phonetics || [];

    const bestPhonetic =
      phonetics.find((p) => p.text && p.audio) ||
      phonetics.find((p) => p.audio) ||
      phonetics.find((p) => p.text) ||
      {};

    return {
      phonetic: bestPhonetic.text || entry.phonetic || null,
      audioUrl: bestPhonetic.audio || null,
    };
  } catch (error) {
    console.log("Could not fetch pronunciation for:", word);
    return {
      phonetic: null,
      audioUrl: null,
    };
  }
}

export async function getWordInfo(word) {
  try {
    // BALANCED: Clear instructions but concise (saves 30% tokens, keeps quality)
    const prompt = `Define "${word}" in JSON format:

{
  "meaning": "Clear, complete definition",
  "synonyms": ["word1", "word2", "word3", "word4", "word5"],
  "antonyms": ["opposite1", "opposite2", "opposite3", "opposite4", "opposite5"],
  "usageExample": "Natural sentence demonstrating word usage"
}

Requirements:
- Synonyms must match word's difficulty level
- Antonyms must be true opposites
- Usage example must be clear and natural
- Return only valid JSON`;

    const [aiResponse, pronunciationData] = await Promise.all([
      groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a vocabulary expert providing accurate definitions. Always return valid JSON with high-quality, educational content.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: MODEL,
        temperature: 0.5,
        max_tokens: 400,
        top_p: 0.9,
        response_format: { type: "json_object" },
      }),
      fetchPronunciation(word),
    ]);

    const responseText = aiResponse.choices[0].message.content;

    let parsedData;
    try {
      const cleanedText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Groq response:", responseText);
      throw new Error("Invalid response format from Groq API");
    }

    if (
      !parsedData.meaning ||
      !parsedData.synonyms ||
      !parsedData.antonyms ||
      !parsedData.usageExample
    ) {
      throw new Error("Incomplete word information from Groq API");
    }

    return {
      meaning: parsedData.meaning,
      synonyms: Array.isArray(parsedData.synonyms) ? parsedData.synonyms : [],
      antonyms: Array.isArray(parsedData.antonyms) ? parsedData.antonyms : [],
      usageExample: parsedData.usageExample,
      phonetic: pronunciationData.phonetic,
      audioUrl: pronunciationData.audioUrl,
    };
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to fetch word information from Groq API");
  }
}

export async function getWordUpdateInfo(word) {
  try {
    const prompt = `Provide 5 antonyms for "${word}" in JSON:

{
  "antonyms": ["opposite1", "opposite2", "opposite3", "opposite4", "opposite5"]
}

Requirements:
- True opposites only
- Match word's difficulty level
- Return only valid JSON`;

    const [aiResponse, pronunciationData] = await Promise.all([
      groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Provide accurate antonyms. Return only JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: MODEL,
        temperature: 0.5,
        max_tokens: 200,
        top_p: 0.9,
        response_format: { type: "json_object" },
      }),
      fetchPronunciation(word),
    ]);

    const responseText = aiResponse.choices[0].message.content;

    let parsedData;
    try {
      const cleanedText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Groq response:", responseText);
      throw new Error("Invalid response format from Groq API");
    }

    return {
      antonyms: Array.isArray(parsedData.antonyms) ? parsedData.antonyms : [],
      phonetic: pronunciationData.phonetic,
      audioUrl: pronunciationData.audioUrl,
    };
  } catch (error) {
    console.error("Error fetching update info:", error);
    throw new Error("Failed to fetch word update information");
  }
}
