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
import type { AuthUser, FeatureTestHealth } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { FeatureTestHealthResponseDto } from '@api/features/dto/feature-test-health-response.dto.js';
import { UpsertFeatureTestHealthDto } from '@api/features/dto/upsert-feature-test-health.dto.js';
import { FeatureTestHealthService } from '@api/features/feature-test-health.service.js';

@ApiTags('test-health')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/test-health')
export class FeatureTestHealthController {
  constructor(private readonly testHealthService: FeatureTestHealthService) {}

  @Get()
  @ApiOperation({ summary: 'Get post-release test health record' })
  @ApiOkResponse({ type: FeatureTestHealthResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  get(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureTestHealth> {
    return this.testHealthService.getForFeature(featureId);
  }

  @Put()
  @ApiOperation({
    summary: 'Create or update CI failure/flaky/duration watch notes',
  })
  @ApiOkResponse({ type: FeatureTestHealthResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  put(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: UpsertFeatureTestHealthDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureTestHealth> {
    return this.testHealthService.upsert(featureId, dto, user.id);
  }
}
