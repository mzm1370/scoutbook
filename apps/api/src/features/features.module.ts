import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeaturesController } from '@api/features/features.controller.js';
import { FeaturesService } from '@api/features/features.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  controllers: [FeaturesController],
  providers: [FeaturesService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
