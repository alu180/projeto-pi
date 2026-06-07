-- DropForeignKey
ALTER TABLE `livros` DROP FOREIGN KEY `livros_userId_fkey`;

-- AlterTable
ALTER TABLE `livros` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'disponivel',
    MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `livros` ADD CONSTRAINT `livros_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
