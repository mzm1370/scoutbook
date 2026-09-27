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
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthUser, FeatureRfcCheck } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { FeatureRfcCheckResponseDto } from '@api/features/dto/feature-rfc-check-response.dto.js';
import { UpsertFeatureRfcCheckDto } from '@api/features/dto/upsert-feature-rfc-check.dto.js';
import { FeatureRfcCheckService } from '@api/features/feature-rfc-check.service.js';

@ApiTags('rfc-check')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/rfc-check')
export class FeatureRfcCheckController {
  constructor(private readonly rfcCheckService: FeatureRfcCheckService) {}

  @Get()
  @ApiOperation({ summary: 'Get RFC check for a Feature' })
  @ApiOkResponse({ type: FeatureRfcCheckResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  get(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureRfcCheck> {
    return this.rfcCheckService.getForFeature(featureId);
  }

  @Put()
  @ApiOperation({
    summary: 'Create or update RFC check (ACCEPTED: PO/PM only)',
  })
  @ApiOkResponse({ type: FeatureRfcCheckResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  put(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: UpsertFeatureRfcCheckDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureRfcCheck> {
    return this.rfcCheckService.upsert(featureId, dto, user.id, user.role);
  }
}
