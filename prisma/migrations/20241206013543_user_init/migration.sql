/*
  Warnings:

  - You are about to drop the column `approved` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `approved`,
    DROP COLUMN `role`;
