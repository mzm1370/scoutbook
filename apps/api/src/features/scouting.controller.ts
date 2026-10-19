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
import type {
  AuthUser,
  ScoutingEntry,
  SeedScoutingChecklistResult,
} from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { CreateScoutingEntryDto } from '@api/features/dto/create-scouting-entry.dto.js';
import { ScoutingEntryResponseDto } from '@api/features/dto/scouting-entry-response.dto.js';
import { SeedScoutingChecklistResponseDto } from '@api/features/dto/seed-scouting-checklist-response.dto.js';
import { UpdateScoutingEntryDto } from '@api/features/dto/update-scouting-entry.dto.js';
import { ScoutingService } from '@api/features/scouting.service.js';

@ApiTags('scouting')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/scouting')
export class ScoutingController {
  constructor(private readonly scoutingService: ScoutingService) {}

  @Get()
  @ApiOperation({ summary: 'List scouting rows for a Feature' })
  @ApiOkResponse({ type: ScoutingEntryResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  list(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<ScoutingEntry[]> {
    return this.scoutingService.listForFeature(featureId);
  }

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Seed missing scouting checklist template questions (does not overwrite)',
  })
  @ApiOkResponse({ type: SeedScoutingChecklistResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  seed(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<SeedScoutingChecklistResult> {
    return this.scoutingService.seedChecklist(featureId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a scouting row' })
  @ApiCreatedResponse({ type: ScoutingEntryResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  create(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: CreateScoutingEntryDto,
    @CurrentUser() user: AuthUser,
  ): Promise<ScoutingEntry> {
    return this.scoutingService.create(featureId, dto, user.role);
  }

  @Patch(':entryId')
  @ApiOperation({ summary: 'Update a scouting row' })
  @ApiOkResponse({ type: ScoutingEntryResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  update(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Param('entryId', ParseIntPipe) entryId: number,
    @Body() dto: UpdateScoutingEntryDto,
    @CurrentUser() user: AuthUser,
  ): Promise<ScoutingEntry> {
    return this.scoutingService.update(featureId, entryId, dto, user.role);
  }
}
