-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "email" TEXT,
    "websiteUrl" TEXT,
    "tokenVersion" INTEGER NOT NULL DEFAULT 1,
    "githubId" TEXT,
    "githubAccessToken" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
