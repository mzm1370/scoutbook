import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeatureRfcCheck } from '@api/features/entities/feature-rfc-check.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import { FeatureRfcCheckController } from '@api/features/feature-rfc-check.controller.js';
import { FeatureRfcCheckService } from '@api/features/feature-rfc-check.service.js';
import { FeaturesController } from '@api/features/features.controller.js';
import { FeaturesService } from '@api/features/features.service.js';
import { ScoutingController } from '@api/features/scouting.controller.js';
import { ScoutingService } from '@api/features/scouting.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feature, ScoutingEntry, FeatureRfcCheck]),
  ],
  controllers: [
    FeaturesController,
    ScoutingController,
    FeatureRfcCheckController,
  ],
  providers: [FeaturesService, ScoutingService, FeatureRfcCheckService],
  exports: [FeaturesService, ScoutingService, FeatureRfcCheckService],
})
export class FeaturesModule {}
