/*
  Warnings:

  - Added the required column `stadium` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `team` ADD COLUMN `stadium` VARCHAR(191) NOT NULL;
