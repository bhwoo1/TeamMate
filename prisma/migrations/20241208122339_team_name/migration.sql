/*
  Warnings:

  - You are about to drop the column `name` on the `team` table. All the data in the column will be lost.
  - Added the required column `teamName` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `team` DROP COLUMN `name`,
    ADD COLUMN `teamName` VARCHAR(191) NOT NULL;
