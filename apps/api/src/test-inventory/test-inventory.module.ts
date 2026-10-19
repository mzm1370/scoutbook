import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@api/auth/auth.module.js';
import { TestInventoryItem } from '@api/test-inventory/entities/test-inventory-item.entity.js';
import { TestInventoryController } from '@api/test-inventory/test-inventory.controller.js';
import { TestInventoryService } from '@api/test-inventory/test-inventory.service.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([TestInventoryItem])],
  controllers: [TestInventoryController],
  providers: [TestInventoryService],
  exports: [TestInventoryService],
})
export class TestInventoryModule {}
