import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from '@api/features/entities/feature.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import { FeaturesController } from '@api/features/features.controller.js';
import { FeaturesService } from '@api/features/features.service.js';
import { ScoutingController } from '@api/features/scouting.controller.js';
import { ScoutingService } from '@api/features/scouting.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Feature, ScoutingEntry])],
  controllers: [FeaturesController, ScoutingController],
  providers: [FeaturesService, ScoutingService],
  exports: [FeaturesService, ScoutingService],
})
export class FeaturesModule {}
