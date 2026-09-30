import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { DecisionNeededItem } from '@scoutbook/types';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { DecisionNeededItemResponseDto } from '@api/features/dto/decision-needed-item-response.dto.js';
import { ScoutingService } from '@api/features/scouting.service.js';

@ApiTags('decisions-needed')
@ApiBearerAuth('access-token')
@Controller('decisions-needed')
export class DecisionsNeededController {
  constructor(private readonly scoutingService: ScoutingService) {}

  @Get()
  @ApiOperation({
    summary: 'List scouting rows that need a PO decision (cross-feature)',
  })
  @ApiOkResponse({ type: DecisionNeededItemResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  list(): Promise<DecisionNeededItem[]> {
    return this.scoutingService.listDecisionNeeded();
  }
}
