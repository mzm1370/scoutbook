import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import type { AuthUser, Feature } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { Roles } from '@api/auth/decorators/roles.decorator.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { RolesGuard } from '@api/auth/guards/roles.guard.js';
import { CreateFeatureDto } from '@api/features/dto/create-feature.dto.js';
import { FeatureResponseDto } from '@api/features/dto/feature-response.dto.js';
import { FeaturesService } from '@api/features/features.service.js';

@ApiTags('features')
@ApiBearerAuth('access-token')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('PO')
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a Feature by id' })
  @ApiOkResponse({ type: FeatureResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Feature> {
    return this.featuresService.findById(id);
  }
}
