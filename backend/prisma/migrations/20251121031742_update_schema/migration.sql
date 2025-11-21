-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "antonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "phonetic" TEXT;
