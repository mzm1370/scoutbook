import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from '@api/features/entities/feature.entity.js';
import { FeatureBugTriage } from '@api/features/entities/feature-bug-triage.entity.js';
import { FeatureImplementationLog } from '@api/features/entities/feature-implementation-log.entity.js';
import { FeatureReleaseLog } from '@api/features/entities/feature-release-log.entity.js';
import { FeatureRelation } from '@api/features/entities/feature-relation.entity.js';
import { FeatureReviewChecklist } from '@api/features/entities/feature-review-checklist.entity.js';
import { FeatureRfcCheck } from '@api/features/entities/feature-rfc-check.entity.js';
import { FeatureRfcDocument } from '@api/features/entities/feature-rfc-document.entity.js';
import { FeatureStageHistory } from '@api/features/entities/feature-stage-history.entity.js';
import { FeatureTestingChecklist } from '@api/features/entities/feature-testing-checklist.entity.js';
import { RaciAssignment } from '@api/features/entities/raci-assignment.entity.js';
import { ScoutingEntry } from '@api/features/entities/scouting-entry.entity.js';
import { FeatureBugTriageController } from '@api/features/feature-bug-triage.controller.js';
import { FeatureBugTriageService } from '@api/features/feature-bug-triage.service.js';
import { DecisionsNeededController } from '@api/features/decisions-needed.controller.js';
import { FeatureImplementationLogController } from '@api/features/feature-implementation-log.controller.js';
import { FeatureImplementationLogService } from '@api/features/feature-implementation-log.service.js';
import { FeatureRaciController } from '@api/features/feature-raci.controller.js';
import { FeatureRaciService } from '@api/features/feature-raci.service.js';
import { FeatureRelationController } from '@api/features/feature-relation.controller.js';
import { FeatureRelationService } from '@api/features/feature-relation.service.js';
import { FeatureReleaseLogController } from '@api/features/feature-release-log.controller.js';
import { FeatureReleaseLogService } from '@api/features/feature-release-log.service.js';
import { FeatureReviewChecklistController } from '@api/features/feature-review-checklist.controller.js';
import { FeatureReviewChecklistService } from '@api/features/feature-review-checklist.service.js';
import { FeatureRfcCheckController } from '@api/features/feature-rfc-check.controller.js';
import { FeatureRfcCheckService } from '@api/features/feature-rfc-check.service.js';
import { FeatureRfcDocumentController } from '@api/features/feature-rfc-document.controller.js';
import { FeatureRfcDocumentService } from '@api/features/feature-rfc-document.service.js';
import { FeatureTestingChecklistController } from '@api/features/feature-testing-checklist.controller.js';
import { FeatureTestingChecklistService } from '@api/features/feature-testing-checklist.service.js';
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
      FeatureRfcDocument,
      RaciAssignment,
      FeatureImplementationLog,
      FeatureTestingChecklist,
      FeatureReviewChecklist,
      FeatureReleaseLog,
      FeatureBugTriage,
      FeatureStageHistory,
      FeatureRelation,
    ]),
  ],
  controllers: [
    FeaturesController,
    ScoutingController,
    DecisionsNeededController,
    FeatureRfcCheckController,
    FeatureRfcDocumentController,
    FeatureRaciController,
    FeatureImplementationLogController,
    FeatureTestingChecklistController,
    FeatureReviewChecklistController,
    FeatureReleaseLogController,
    FeatureBugTriageController,
    FeatureRelationController,
  ],
  providers: [
    FeaturesService,
    ScoutingService,
    FeatureRfcCheckService,
    FeatureRfcDocumentService,
    FeatureRaciService,
    FeatureImplementationLogService,
    FeatureTestingChecklistService,
    FeatureReviewChecklistService,
    FeatureReleaseLogService,
    FeatureBugTriageService,
    FeatureRelationService,
  ],
  exports: [
    FeaturesService,
    ScoutingService,
    FeatureRfcCheckService,
    FeatureRfcDocumentService,
    FeatureRaciService,
    FeatureImplementationLogService,
    FeatureTestingChecklistService,
    FeatureReviewChecklistService,
    FeatureReleaseLogService,
    FeatureBugTriageService,
    FeatureRelationService,
  ],
})
export class FeaturesModule {}
