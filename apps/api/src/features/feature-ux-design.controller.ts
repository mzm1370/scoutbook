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
import type { AuthUser, FeatureUxDesign } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { FeatureUxDesignResponseDto } from '@api/features/dto/feature-ux-design-response.dto.js';
import { UpsertFeatureUxDesignDto } from '@api/features/dto/upsert-feature-ux-design.dto.js';
import { FeatureUxDesignService } from '@api/features/feature-ux-design.service.js';

@ApiTags('ux-design')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/ux-design')
export class FeatureUxDesignController {
  constructor(private readonly uxDesignService: FeatureUxDesignService) {}

  @Get()
  @ApiOperation({ summary: 'Get UX design record for a Feature' })
  @ApiOkResponse({ type: FeatureUxDesignResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  get(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureUxDesign> {
    return this.uxDesignService.getForFeature(featureId);
  }

  @Put()
  @ApiOperation({
    summary: 'Create or update UX design (happy/empty/loading/error)',
  })
  @ApiOkResponse({ type: FeatureUxDesignResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  put(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: UpsertFeatureUxDesignDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureUxDesign> {
    return this.uxDesignService.upsert(featureId, dto, user.id);
  }
}
