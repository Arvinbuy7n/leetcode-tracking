-- CreateTable
CREATE TABLE "public"."CompletedProblems" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "titleSlug" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompletedProblems_pkey" PRIMARY KEY ("id")
);
