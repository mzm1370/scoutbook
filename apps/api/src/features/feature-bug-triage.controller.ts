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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthUser, FeatureBugTriage } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { CreateFeatureBugTriageDto } from '@api/features/dto/create-feature-bug-triage.dto.js';
import { FeatureBugTriageResponseDto } from '@api/features/dto/feature-bug-triage-response.dto.js';
import { UpdateFeatureBugTriageDto } from '@api/features/dto/update-feature-bug-triage.dto.js';
import { FeatureBugTriageService } from '@api/features/feature-bug-triage.service.js';

@ApiTags('bugs')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/bugs')
export class FeatureBugTriageController {
  constructor(private readonly bugTriageService: FeatureBugTriageService) {}

  @Get()
  @ApiOperation({ summary: 'List bug triage rows for a Feature' })
  @ApiOkResponse({ type: FeatureBugTriageResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  list(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureBugTriage[]> {
    return this.bugTriageService.listForFeature(featureId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a bug triage row' })
  @ApiCreatedResponse({ type: FeatureBugTriageResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  create(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: CreateFeatureBugTriageDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureBugTriage> {
    return this.bugTriageService.create(featureId, dto, user.id);
  }

  @Patch(':bugId')
  @ApiOperation({ summary: 'Update a bug triage row' })
  @ApiOkResponse({ type: FeatureBugTriageResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  update(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Param('bugId', ParseIntPipe) bugId: number,
    @Body() dto: UpdateFeatureBugTriageDto,
  ): Promise<FeatureBugTriage> {
    return this.bugTriageService.update(featureId, bugId, dto);
  }
}
