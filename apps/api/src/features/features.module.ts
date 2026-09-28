import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeatureRfcCheck } from '@api/features/entities/feature-rfc-check.entity.js';
import { RaciAssignment } from '@api/features/entities/raci-assignment.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import { FeatureRaciController } from '@api/features/feature-raci.controller.js';
import { FeatureRaciService } from '@api/features/feature-raci.service.js';
import { FeatureRfcCheckController } from '@api/features/feature-rfc-check.controller.js';
import { FeatureRfcCheckService } from '@api/features/feature-rfc-check.service.js';
import { FeaturesController } from '@api/features/features.controller.js';
import { FeaturesService } from '@api/features/features.service.js';
import { ScoutingController } from '@api/features/scouting.controller.js';
import { ScoutingService } from '@api/features/scouting.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Feature,
      ScoutingEntry,
      FeatureRfcCheck,
      RaciAssignment,
    ]),
  ],
  controllers: [
    FeaturesController,
    ScoutingController,
    FeatureRfcCheckController,
    FeatureRaciController,
  ],
  providers: [
    FeaturesService,
    ScoutingService,
    FeatureRfcCheckService,
    FeatureRaciService,
  ],
  exports: [
    FeaturesService,
    ScoutingService,
    FeatureRfcCheckService,
    FeatureRaciService,
  ],
})
export class FeaturesModule {}
