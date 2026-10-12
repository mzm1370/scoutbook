import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import type {
  AuthUser,
  Feature,
  FeatureStageHistory,
} from '@scoutbook/types';
import { CheckPolicies } from '@api/auth/casl/check-policies.decorator.js';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { PoliciesGuard } from '@api/auth/guards/policies.guard.js';
import { AdvanceFeatureStageDto } from '@api/features/dto/advance-feature-stage.dto.js';
import { CreateFeatureDto } from '@api/features/dto/create-feature.dto.js';
import { FeatureResponseDto } from '@api/features/dto/feature-response.dto.js';
import { FeatureStageHistoryResponseDto } from '@api/features/dto/feature-stage-history-response.dto.js';
import { UpdateFeatureDto } from '@api/features/dto/update-feature.dto.js';
import { FeaturesService } from '@api/features/features.service.js';

@ApiTags('features')
@ApiBearerAuth('access-token')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can('create', 'Feature'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a Feature (PO only)' })
  @ApiCreatedResponse({ type: FeatureResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  create(
    @Body() dto: CreateFeatureDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Feature> {
    return this.featuresService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all Features' })
  @ApiOkResponse({ type: FeatureResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  findAll(): Promise<Feature[]> {
    return this.featuresService.findAll();
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can('update', 'Feature'))
  @ApiOperation({
    summary:
      'Update Feature process track and/or risk (PO/PM; before Implementation)',
  })
  @ApiOkResponse({ type: FeatureResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFeatureDto,
  ): Promise<Feature> {
    return this.featuresService.update(id, dto);
  }

  @Patch(':id/stage')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can('advance', 'Feature'))
  @ApiOperation({
    summary: 'Advance Feature one stage (PO/PM only, forward one step)',
  })
  @ApiOkResponse({ type: FeatureResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  advanceStage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdvanceFeatureStageDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Feature> {
    return this.featuresService.advanceStage(id, dto, user.id);
  }

  @Get(':id/stage-history')
  @ApiOperation({ summary: 'List Feature stage history (oldest first)' })
  @ApiOkResponse({ type: FeatureStageHistoryResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  listStageHistory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FeatureStageHistory[]> {
    return this.featuresService.listStageHistory(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Feature by id' })
  @ApiOkResponse({ type: FeatureResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Feature> {
    return this.featuresService.findById(id);
  }
}
