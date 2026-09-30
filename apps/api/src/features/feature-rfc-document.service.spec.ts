import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureRfcDocumentService } from '@api/features/feature-rfc-document.service.js';

describe('FeatureRfcDocumentService', () => {
  const rfcDocRepo = {
    findOneBy: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };
  const featuresService = {
    findById: vi.fn(),
  };

  let service: FeatureRfcDocumentService;

  const baseRow = {
    id: 1,
    featureId: 10,
    status: 'DRAFT' as const,
    summary: 'Bulk assign design',
    motivation: 'ACL unclear',
    detailedDesign: 'New endpoint with dry-run',
    alternatives: 'Loop assign',
    drawbacks: 'More API surface',
    updatedByUserId: 9,
    createdAt: new Date('2026-09-30T12:00:00.000Z'),
    updatedAt: new Date('2026-09-30T12:00:00.000Z'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    featuresService.findById.mockResolvedValue({ id: 10 });
    rfcDocRepo.create.mockImplementation((row) => row);
    service = new FeatureRfcDocumentService(
      rfcDocRepo as never,
      featuresService as never,
    );
  });

  it('gets an existing document', async () => {
    rfcDocRepo.findOneBy.mockResolvedValue(baseRow);
    const result = await service.getForFeature(10);
    expect(result.status).toBe('DRAFT');
    expect(result.summary).toBe('Bulk assign design');
  });

  it('404 when missing', async () => {
    rfcDocRepo.findOneBy.mockResolvedValue(null);
    await expect(service.getForFeature(10)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('allows developer to save DRAFT', async () => {
    rfcDocRepo.findOneBy.mockResolvedValue(null);
    rfcDocRepo.save.mockResolvedValue(baseRow);
    const result = await service.upsert(
      10,
      { status: 'DRAFT', summary: 'wip' },
      3,
      'DEVELOPER',
    );
    expect(result.status).toBe('DRAFT');
  });

  it('forbids developer ACCEPTED', async () => {
    rfcDocRepo.findOneBy.mockResolvedValue(null);
    await expect(
      service.upsert(
        10,
        {
          status: 'ACCEPTED',
          summary: 'Bulk assign design',
          motivation: 'ACL unclear',
          detailedDesign: 'New endpoint with dry-run',
        },
        3,
        'DEVELOPER',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects ACCEPTED without body fields', async () => {
    rfcDocRepo.findOneBy.mockResolvedValue(null);
    await expect(
      service.upsert(10, { status: 'ACCEPTED', summary: 'hi' }, 1, 'PO'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('PO can ACCEPT with full body', async () => {
    rfcDocRepo.findOneBy.mockResolvedValue(null);
    rfcDocRepo.save.mockImplementation(async (row) => ({
      ...baseRow,
      ...row,
      id: 1,
      createdAt: baseRow.createdAt,
      updatedAt: baseRow.updatedAt,
    }));
    const result = await service.upsert(
      10,
      {
        status: 'ACCEPTED',
        summary: 'Bulk assign design',
        motivation: 'ACL unclear',
        detailedDesign: 'New endpoint with dry-run',
        alternatives: 'Loop',
        drawbacks: 'Surface',
      },
      1,
      'PO',
    );
    expect(result.status).toBe('ACCEPTED');
  });
});
