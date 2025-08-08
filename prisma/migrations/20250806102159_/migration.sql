/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[titleSlug]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `titleSlug` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_userId_fkey";

-- DropIndex
DROP INDEX "public"."Task_slug_key";

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "createdAt",
DROP COLUMN "difficulty",
DROP COLUMN "slug",
DROP COLUMN "title",
ADD COLUMN     "titleSlug" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Submission";

-- DropTable
DROP TABLE "public"."User";

-- CreateIndex
CREATE UNIQUE INDEX "Task_titleSlug_key" ON "public"."Task"("titleSlug");
