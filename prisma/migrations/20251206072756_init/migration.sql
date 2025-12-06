-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "topic" TEXT NOT NULL,
    "targetAudience" TEXT,
    "keyPoints" TEXT,
    "tone" TEXT,
    "generatedNote" TEXT,
    "generatedX" TEXT,
    "noteUrl" TEXT,
    "xUrl" TEXT,
    "rawPrompt" TEXT
);
