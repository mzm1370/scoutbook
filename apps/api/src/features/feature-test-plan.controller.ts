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
import type { AuthUser, FeatureTestPlan } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { FeatureTestPlanResponseDto } from '@api/features/dto/feature-test-plan-response.dto.js';
import { UpsertFeatureTestPlanDto } from '@api/features/dto/upsert-feature-test-plan.dto.js';
import { FeatureTestPlanService } from '@api/features/feature-test-plan.service.js';

@ApiTags('test-plan')
@ApiBearerAuth('access-token')
@Controller('features/:featureId/test-plan')
export class FeatureTestPlanController {
  constructor(private readonly testPlanService: FeatureTestPlanService) {}

  @Get()
  @ApiOperation({ summary: 'Get test plan record for a Feature' })
  @ApiOkResponse({ type: FeatureTestPlanResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  get(
    @Param('featureId', ParseIntPipe) featureId: number,
  ): Promise<FeatureTestPlan> {
    return this.testPlanService.getForFeature(featureId);
  }

  @Put()
  @ApiOperation({
    summary: 'Create or update Unit/Integration/E2E test plan',
  })
  @ApiOkResponse({ type: FeatureTestPlanResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  put(
    @Param('featureId', ParseIntPipe) featureId: number,
    @Body() dto: UpsertFeatureTestPlanDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureTestPlan> {
    return this.testPlanService.upsert(featureId, dto, user.id);
  }
}
