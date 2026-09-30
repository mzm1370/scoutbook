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
import type {
  AuthUser,
  FeatureImplementationLog,
} from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { FeatureImplementationLogResponseDto } from '@api/features/dto/feature-implementation-log-response.dto.js';
import { UpsertFeatureImplementationLogDto } from '@api/features/dto/upsert-feature-implementation-log.dto.js';
import { FeatureImplementationLogService } from '@api/features/feature-implementation-log.service.js';

@ApiTags('implementation-log')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/implementation-log')
export class FeatureImplementationLogController {
  constructor(
    private readonly implementationLogService: FeatureImplementationLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get implementation log for a Feature' })
  @ApiOkResponse({ type: FeatureImplementationLogResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  get(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureImplementationLog> {
    return this.implementationLogService.getForFeature(featureId);
  }

  @Put()
  @ApiOperation({ summary: 'Create or update implementation log' })
  @ApiOkResponse({ type: FeatureImplementationLogResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  put(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: UpsertFeatureImplementationLogDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureImplementationLog> {
    return this.implementationLogService.upsert(featureId, dto, user.id);
  }
}
