/*
  Warnings:

  - Added the required column `background` to the `NPC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job` to the `NPC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skills` to the `NPC` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."NPC" ADD COLUMN     "background" TEXT NOT NULL,
ADD COLUMN     "job" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT NOT NULL;
