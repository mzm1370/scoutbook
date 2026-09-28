import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
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
import type { RaciAssignment } from '@scoutbook/types';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { RaciAssignmentResponseDto } from '@api/features/dto/raci-assignment-response.dto.js';
import { ReplaceFeatureRaciDto } from '@api/features/dto/replace-feature-raci.dto.js';
import { FeatureRaciService } from '@api/features/feature-raci.service.js';

@ApiTags('raci')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/raci')
export class FeatureRaciController {
  constructor(private readonly raciService: FeatureRaciService) {}

  @Get()
  @ApiOperation({ summary: 'List RACI rows for a Feature' })
  @ApiOkResponse({ type: RaciAssignmentResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  list(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<RaciAssignment[]> {
    return this.raciService.listForFeature(featureId);
  }

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Seed default RACI steps if the matrix is empty',
  })
  @ApiOkResponse({ type: RaciAssignmentResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  async seed(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<RaciAssignment[]> {
    const result = await this.raciService.seedDefaults(featureId);
    return result.rows;
  }

  @Put()
  @ApiOperation({ summary: 'Replace the full RACI matrix' })
  @ApiOkResponse({ type: RaciAssignmentResponseDto, isArray: true })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  replace(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: ReplaceFeatureRaciDto,
  ): Promise<RaciAssignment[]> {
    return this.raciService.replace(featureId, dto);
  }
}
