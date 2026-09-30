import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthUser, FeatureRelation } from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { Roles } from '@api/auth/decorators/roles.decorator.js';
import { RolesGuard } from '@api/auth/guards/roles.guard.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { CreateFeatureRelationDto } from '@api/features/dto/create-feature-relation.dto.js';
import { FeatureRelationResponseDto } from '@api/features/dto/feature-relation-response.dto.js';
import { FeatureRelationService } from '@api/features/feature-relation.service.js';

@ApiTags('feature-relations')
@ApiBearerAuth('access-token')
@Controller('feature-relations')
export class FeatureRelationController {
  constructor(private readonly relationService: FeatureRelationService) {}

  @Get()
  @ApiOperation({ summary: 'List all Feature BLOCKS relations' })
  @ApiOkResponse({ type: FeatureRelationResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  list(): Promise<FeatureRelation[]> {
    return this.relationService.listAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('PO', 'PM')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a BLOCKS link (PO/PM only)' })
  @ApiCreatedResponse({ type: FeatureRelationResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  create(
    @Body() dto: CreateFeatureRelationDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FeatureRelation> {
    return this.relationService.create(dto, user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('PO', 'PM')
  @ApiOperation({ summary: 'Delete a Feature relation (PO/PM only)' })
  @ApiOkResponse({ type: FeatureRelationResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FeatureRelation> {
    return this.relationService.remove(id);
  }
}
