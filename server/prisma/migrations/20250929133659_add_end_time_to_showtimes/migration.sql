/*
  Warnings:

  - Added the required column `end_time` to the `showtimes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `showtimes` ADD COLUMN `end_time` DATETIME(3) NOT NULL;
