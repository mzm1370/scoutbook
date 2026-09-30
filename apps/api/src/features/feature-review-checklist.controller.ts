import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthUser, FeatureReviewChecklist } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { FeatureReviewChecklistResponseDto } from '@api/features/dto/feature-review-checklist-response.dto.js';
import { UpsertFeatureReviewChecklistDto } from '@api/features/dto/upsert-feature-review-checklist.dto.js';
import { FeatureReviewChecklistService } from '@api/features/feature-review-checklist.service.js';

@ApiTags('review-checklist')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/review-checklist')
export class FeatureReviewChecklistController {
  constructor(
    private readonly reviewChecklistService: FeatureReviewChecklistService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get review checklist for a Feature' })
  @ApiOkResponse({ type: FeatureReviewChecklistResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  get(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureReviewChecklist> {
    return this.reviewChecklistService.getForFeature(featureId);
  }

  @Put()
  @ApiOperation({ summary: 'Create or update review checklist' })
  @ApiOkResponse({ type: FeatureReviewChecklistResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  put(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: UpsertFeatureReviewChecklistDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureReviewChecklist> {
    return this.reviewChecklistService.upsert(featureId, dto, user.id);
  }
}
