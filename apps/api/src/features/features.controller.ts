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
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CreateFeatureDto } from './dto/create-feature.dto.js';
import { FeatureResponseDto } from './dto/feature-response.dto.js';
import { FeaturesService } from './features.service.js';

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
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  create(
    @Body() dto: CreateFeatureDto,
    @CurrentUser() user: AuthUser,
  ): Promise<Feature> {
    return this.featuresService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all Features' })
  @ApiOkResponse({ type: FeatureResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  findAll(): Promise<Feature[]> {
    return this.featuresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Feature by id' })
  @ApiOkResponse({ type: FeatureResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Feature> {
    return this.featuresService.findById(id);
  }
}
