import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fetch pronunciation from Free Dictionary API
async function fetchPronunciation(word) {
  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
      )}`
    );

    const entry = response.data[0];
    const phonetics = entry.phonetics || [];

    // Find the best phonetic entry (one with both text and audio)
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Provide detailed standard information about the word "${word}" in the following JSON format. Only respond with valid JSON, no additional text:

{
  "meaning": "Clear and concise and standard definition of the word",
  "synonyms": ["synonym1", "synonym2", "synonym3", "synonym4", "synonym5"],
  "antonyms": ["antonym1", "antonym2", "antonym3", "antonym4", "antonym5"],
  "usageExample": "A natural sentence using the word in context"
}

Important:
- Provide exactly 5 synonyms that are of SIMILAR DIFFICULTY LEVEL as the original word (if the word is advanced/GRE-level, provide advanced synonyms; if basic, provide basic synonyms)
- Provide exactly 5 antonyms (words with opposite meaning) that are also of similar difficulty level
- Make the usage example clear and natural
- Keep the meaning concise but comprehensive
- Ensure the response is valid JSON only`;

    // Fetch word info and pronunciation in parallel
    const [result, pronunciationData] = await Promise.all([
      model.generateContent(prompt),
      fetchPronunciation(word),
    ]);

    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Invalid response format from Gemini API");
    }

    // Validate the response structure
    if (
      !parsedData.meaning ||
      !parsedData.synonyms ||
      !parsedData.antonyms ||
      !parsedData.usageExample
    ) {
      throw new Error("Incomplete word information from Gemini API");
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
    console.error("Gemini API error:", error);
    throw new Error("Failed to fetch word information from Gemini API");
  }
}

// Function to update existing words with new fields (antonyms + pronunciation)
export async function getWordUpdateInfo(word) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `For the word "${word}", provide antonyms in the following JSON format. Only respond with valid JSON:

{
  "antonyms": ["antonym1", "antonym2", "antonym3", "antonym4", "antonym5"]
}

Important:
- Provide exactly 5 antonyms (words with opposite meaning)
- Antonyms should be of similar difficulty level as the original word
- Ensure the response is valid JSON only`;

    const [result, pronunciationData] = await Promise.all([
      model.generateContent(prompt),
      fetchPronunciation(word),
    ]);

    const response = await result.response;
    const text = response.text();

    let parsedData;
    try {
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Invalid response format from Gemini API");
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
