/*
  Warnings:

  - You are about to drop the column `description` on the `team` table. All the data in the column will be lost.
  - Added the required column `teamLogo` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `team` DROP COLUMN `description`,
    ADD COLUMN `teamLogo` VARCHAR(191) NOT NULL;
