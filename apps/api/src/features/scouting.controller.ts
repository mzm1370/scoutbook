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
import type { ScoutingEntry } from '@scoutbook/types';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { CreateScoutingEntryDto } from '@api/features/dto/create-scouting-entry.dto.js';
import { ScoutingEntryResponseDto } from '@api/features/dto/scouting-entry-response.dto.js';
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
  ): Promise<ScoutingEntry> {
    return this.scoutingService.create(featureId, dto);
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
  ): Promise<ScoutingEntry> {
    return this.scoutingService.update(featureId, entryId, dto);
  }
}
