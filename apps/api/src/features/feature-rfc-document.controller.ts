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
import type { AuthUser, FeatureRfcDocument } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { FeatureRfcDocumentResponseDto } from '@api/features/dto/feature-rfc-document-response.dto.js';
import { UpsertFeatureRfcDocumentDto } from '@api/features/dto/upsert-feature-rfc-document.dto.js';
import { FeatureRfcDocumentService } from '@api/features/feature-rfc-document.service.js';

@ApiTags('rfc')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/rfc')
export class FeatureRfcDocumentController {
  constructor(private readonly rfcDocumentService: FeatureRfcDocumentService) {}

  @Get()
  @ApiOperation({ summary: 'Get RFC document for a Feature' })
  @ApiOkResponse({ type: FeatureRfcDocumentResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  get(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureRfcDocument> {
    return this.rfcDocumentService.getForFeature(featureId);
  }

  @Put()
  @ApiOperation({
    summary: 'Create or update RFC document (ACCEPTED/REJECTED: PO/PM only)',
  })
  @ApiOkResponse({ type: FeatureRfcDocumentResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  put(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: UpsertFeatureRfcDocumentDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureRfcDocument> {
    return this.rfcDocumentService.upsert(
      featureId,
      dto,
      user.id,
      user.role,
    );
  }
}
