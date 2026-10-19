import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  SCOUTING_STATUSES,
  type AmbiguityTrackingItem,
  type ScoutingStatus,
} from '@scoutbook/types';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { AmbiguityTrackingItemResponseDto } from '@api/features/dto/ambiguity-tracking-item-response.dto.js';
import { ScoutingService } from '@api/features/scouting.service.js';

function parseStatusQuery(
  raw: string | string[] | undefined,
): ScoutingStatus[] | undefined {
  if (raw === undefined) return undefined;
  const parts = (Array.isArray(raw) ? raw : [raw])
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts as ScoutingStatus[];
}

@ApiTags('ambiguity-tracking')
@ApiBearerAuth('access-token')
@Controller('ambiguity-tracking')
export class AmbiguityTrackingController {
  constructor(private readonly scoutingService: ScoutingService) {}

  @Get()
  @ApiOperation({
    summary:
      'List scouting ambiguity rows across Features (optional status filter)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    isArray: true,
    enum: SCOUTING_STATUSES,
    description:
      'Filter by status (repeat or comma-separated). Omit for all statuses.',
  })
  @ApiOkResponse({ type: AmbiguityTrackingItemResponseDto, isArray: true })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  list(
    @Query('status') status?: string | string[],
  ): Promise<AmbiguityTrackingItem[]> {
    return this.scoutingService.listAmbiguityTracking(parseStatusQuery(status));
  }
}
