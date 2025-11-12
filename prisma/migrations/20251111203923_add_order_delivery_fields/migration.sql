/*
  Warnings:

  - You are about to drop the column `shippingAddress` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `order` table. All the data in the column will be lost.
  - Added the required column `courier` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `shippingAddress`,
    DROP COLUMN `total`,
    ADD COLUMN `courier` VARCHAR(191) NOT NULL,
    ADD COLUMN `deliveryAddress` VARCHAR(191) NULL,
    ADD COLUMN `deliveryCity` VARCHAR(191) NULL,
    ADD COLUMN `deliveryMethod` VARCHAR(191) NOT NULL,
    ADD COLUMN `deliveryOffice` VARCHAR(191) NULL,
    ADD COLUMN `deliveryPostalCode` VARCHAR(191) NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalAmount` DOUBLE NOT NULL;
