import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getWordInfo(word) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Provide detailed information about the word "${word}" in the following JSON format. Only respond with valid JSON, no additional text:

{
  "meaning": "Clear and concise definition of the word",
  "synonyms": ["synonym1", "synonym2", "synonym3", "synonym4", "synonym5"],
  "usageExample": "A natural sentence using the word in context"
}

Important:
- Provide 5 common synonyms
- Make the usage example clear and natural
- Keep the meaning concise but comprehensive
- Ensure the response is valid JSON only`;

    const result = await model.generateContent(prompt);
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
      !parsedData.usageExample
    ) {
      throw new Error("Incomplete word information from Gemini API");
    }

    return {
      meaning: parsedData.meaning,
      synonyms: Array.isArray(parsedData.synonyms) ? parsedData.synonyms : [],
      usageExample: parsedData.usageExample,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to fetch word information from Gemini API");
  }
}
