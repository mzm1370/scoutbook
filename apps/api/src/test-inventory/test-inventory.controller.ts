import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  TEST_INVENTORY_TIERS,
  type AuthUser,
  type SeedTestInventoryResult,
  type TestInventoryItem,
  type TestInventoryTier,
} from '@scoutbook/types';
import { CheckPolicies } from '@api/auth/casl/check-policies.decorator.js';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { PoliciesGuard } from '@api/auth/guards/policies.guard.js';
import { ApiFailureEnvelopeDto } from '@api/common/dto/error-response.dto.js';
import { CreateTestInventoryItemDto } from '@api/test-inventory/dto/create-test-inventory-item.dto.js';
import { TestInventoryItemResponseDto } from '@api/test-inventory/dto/test-inventory-item-response.dto.js';
import { UpdateTestInventoryItemDto } from '@api/test-inventory/dto/update-test-inventory-item.dto.js';
import { TestInventoryService } from '@api/test-inventory/test-inventory.service.js';

@ApiTags('test-inventory')
@ApiBearerAuth('access-token')
@Controller('test-inventory')
export class TestInventoryController {
  constructor(private readonly inventoryService: TestInventoryService) {}

  @Get()
  @ApiOperation({ summary: 'List risk-based test inventory rows' })
  @ApiQuery({
    name: 'tier',
    required: false,
    enum: TEST_INVENTORY_TIERS,
  })
  @ApiOkResponse({ type: TestInventoryItemResponseDto, isArray: true })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  list(@Query('tier') tier?: TestInventoryTier): Promise<TestInventoryItem[]> {
    return this.inventoryService.list(tier);
  }

  @Post('seed')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can('manage', 'TestInventory'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Seed default inventory rows if the table is empty',
  })
  @ApiOkResponse({ description: 'Seed result with rows' })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  seed(): Promise<SeedTestInventoryResult> {
    return this.inventoryService.seedDefaults();
  }

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can('manage', 'TestInventory'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a test inventory row' })
  @ApiCreatedResponse({ type: TestInventoryItemResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  create(
    @Body() dto: CreateTestInventoryItemDto,
    @CurrentUser() user: AuthUser,
  ): Promise<TestInventoryItem> {
    return this.inventoryService.create(dto, user.role);
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can('manage', 'TestInventory'))
  @ApiOperation({ summary: 'Update a test inventory row' })
  @ApiOkResponse({ type: TestInventoryItemResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTestInventoryItemDto,
    @CurrentUser() user: AuthUser,
  ): Promise<TestInventoryItem> {
    return this.inventoryService.update(id, dto, user.role);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can('manage', 'TestInventory'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a test inventory row' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  @ApiForbiddenResponse({ type: ApiFailureEnvelopeDto })
  @ApiNotFoundResponse({ type: ApiFailureEnvelopeDto })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ): Promise<void> {
    await this.inventoryService.remove(id, user.role);
  }
}
