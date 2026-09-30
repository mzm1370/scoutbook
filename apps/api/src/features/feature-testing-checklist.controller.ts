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
import type { AuthUser, FeatureTestingChecklist } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { FeatureTestingChecklistResponseDto } from '@api/features/dto/feature-testing-checklist-response.dto.js';
import { UpsertFeatureTestingChecklistDto } from '@api/features/dto/upsert-feature-testing-checklist.dto.js';
import { FeatureTestingChecklistService } from '@api/features/feature-testing-checklist.service.js';

@ApiTags('testing-checklist')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/testing-checklist')
export class FeatureTestingChecklistController {
  constructor(
    private readonly testingChecklistService: FeatureTestingChecklistService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get testing checklist for a Feature' })
  @ApiOkResponse({ type: FeatureTestingChecklistResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  get(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureTestingChecklist> {
    return this.testingChecklistService.getForFeature(featureId);
  }

  @Put()
  @ApiOperation({ summary: 'Create or update testing checklist' })
  @ApiOkResponse({ type: FeatureTestingChecklistResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  put(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: UpsertFeatureTestingChecklistDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureTestingChecklist> {
    return this.testingChecklistService.upsert(featureId, dto, user.id);
  }
}
