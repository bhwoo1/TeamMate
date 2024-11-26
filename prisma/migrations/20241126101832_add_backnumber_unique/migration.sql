/*
  Warnings:

  - A unique constraint covering the columns `[backnumber]` on the table `Roster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Roster_backnumber_key` ON `Roster`(`backnumber`);
