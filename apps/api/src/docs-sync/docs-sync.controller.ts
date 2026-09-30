import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type {
  AuthUser,
  DocsSyncConnection,
  DocsSyncResult,
} from '@scoutbook/types';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { Roles } from '@api/auth/decorators/roles.decorator.js';
import { RolesGuard } from '@api/auth/guards/roles.guard.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import {
  DocsSyncConnectionResponseDto,
  DocsSyncResultResponseDto,
} from '@api/docs-sync/dto/docs-sync-response.dto.js';
import { UpsertDocsSyncConnectionDto } from '@api/docs-sync/dto/upsert-docs-sync-connection.dto.js';
import { DocsSyncService } from '@api/docs-sync/docs-sync.service.js';

@ApiTags('docs-sync')
@ApiBearerAuth('access-token')
@Controller('docs-sync')
export class DocsSyncController {
  constructor(private readonly docsSyncService: DocsSyncService) {}

  @Get('connection')
  @ApiOperation({ summary: 'Get GitHub docs sync connection status' })
  @ApiOkResponse({ type: DocsSyncConnectionResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  getConnection(): Promise<DocsSyncConnection> {
    return this.docsSyncService.getConnection();
  }

  @Put('connection')
  @UseGuards(RolesGuard)
  @Roles('PO')
  @ApiOperation({ summary: 'Upsert GitHub docs sync connection (PO only)' })
  @ApiOkResponse({ type: DocsSyncConnectionResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  upsert(
    @Body() dto: UpsertDocsSyncConnectionDto,
    @CurrentUser() user: AuthUser,
  ): Promise<DocsSyncConnection> {
    return this.docsSyncService.upsertConnection(dto, user.id);
  }

  @Delete('connection')
  @UseGuards(RolesGuard)
  @Roles('PO')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete GitHub docs sync connection (PO only)' })
  @ApiOkResponse({ type: DocsSyncConnectionResponseDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  async remove(): Promise<DocsSyncConnection> {
    await this.docsSyncService.deleteConnection();
    return this.docsSyncService.getConnection();
  }

  @Post('sync')
  @UseGuards(RolesGuard)
  @Roles('PO')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync Feature docs to GitHub via PR (PO only)' })
  @ApiOkResponse({ type: DocsSyncResultResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  sync(): Promise<DocsSyncResult> {
    return this.docsSyncService.sync();
  }
}
