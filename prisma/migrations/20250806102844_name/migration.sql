/*
  Warnings:

  - You are about to drop the column `titleSlug` on the `Task` table. All the data in the column will be lost.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Task_titleSlug_key";

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "titleSlug",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "taskSlugs" TEXT[];
