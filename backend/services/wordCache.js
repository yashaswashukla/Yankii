import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCachedWordInfo(word) {
  try {
    const existingWord = await prisma.word.findFirst({
      where: {
        word: {
          equals: word.toLowerCase(),
          mode: "insensitive",
        },
      },
      select: {
        meaning: true,
        synonyms: true,
        antonyms: true,
        usageExample: true,
        phonetic: true,
        audioUrl: true,
      },
    });

    // Only use cache if it has ALL required fields with good data
    if (
      existingWord &&
      existingWord.meaning &&
      existingWord.meaning.length > 10 &&
      existingWord.synonyms?.length >= 5 &&
      existingWord.antonyms?.length >= 5
    ) {
      console.log(`✅ Cache hit: "${word}" - 0 tokens used!`);
      return existingWord;
    }

    console.log(`❌ Cache miss: "${word}" - fetching from AI...`);
    return null;
  } catch (error) {
    console.error("Cache lookup error:", error);
    return null;
  }
}
