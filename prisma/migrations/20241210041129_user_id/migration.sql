/*
  Warnings:

  - You are about to drop the column `email` on the `teamuser` table. All the data in the column will be lost.
  - Added the required column `userId` to the `TeamUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `teamuser` DROP FOREIGN KEY `TeamUser_email_fkey`;

-- AlterTable
ALTER TABLE `teamuser` DROP COLUMN `email`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TeamUser` ADD CONSTRAINT `TeamUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
