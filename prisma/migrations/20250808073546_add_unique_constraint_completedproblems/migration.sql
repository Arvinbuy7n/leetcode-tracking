/*
  Warnings:

  - A unique constraint covering the columns `[username,titleSlug]` on the table `CompletedProblems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CompletedProblems_username_titleSlug_key" ON "public"."CompletedProblems"("username", "titleSlug");
