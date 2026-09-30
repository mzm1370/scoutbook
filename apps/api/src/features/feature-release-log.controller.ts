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
import type { AuthUser, FeatureReleaseLog } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { FeatureReleaseLogResponseDto } from '@api/features/dto/feature-release-log-response.dto.js';
import { UpsertFeatureReleaseLogDto } from '@api/features/dto/upsert-feature-release-log.dto.js';
import { FeatureReleaseLogService } from '@api/features/feature-release-log.service.js';

@ApiTags('release-log')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/release-log')
export class FeatureReleaseLogController {
  constructor(
    private readonly releaseLogService: FeatureReleaseLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get release log for a Feature' })
  @ApiOkResponse({ type: FeatureReleaseLogResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  get(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureReleaseLog> {
    return this.releaseLogService.getForFeature(featureId);
  }

  @Put()
  @ApiOperation({ summary: 'Create or update release log' })
  @ApiOkResponse({ type: FeatureReleaseLogResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  put(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: UpsertFeatureReleaseLogDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureReleaseLog> {
    return this.releaseLogService.upsert(featureId, dto, user.id);
  }
}
