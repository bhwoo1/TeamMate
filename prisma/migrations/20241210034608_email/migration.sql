/*
  Warnings:

  - You are about to drop the column `userId` on the `teamuser` table. All the data in the column will be lost.
  - Added the required column `email` to the `TeamUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `teamuser` DROP FOREIGN KEY `TeamUser_userId_fkey`;

-- DropIndex
DROP INDEX `TeamUser_userId_key` ON `teamuser`;

-- AlterTable
ALTER TABLE `teamuser` DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TeamUser` ADD CONSTRAINT `TeamUser_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
