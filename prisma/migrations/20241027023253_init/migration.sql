/*
  Warnings:

  - Added the required column `postedadmin` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notice` ADD COLUMN `postedadmin` VARCHAR(191) NOT NULL;
