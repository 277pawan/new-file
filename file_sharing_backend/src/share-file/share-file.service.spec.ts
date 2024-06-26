import { Test, TestingModule } from '@nestjs/testing';
import { SharedFileService } from './share-file.service';

describe('ShareFileService', () => {
  let service: SharedFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedFileService],
    }).compile();

    service = module.get<SharedFileService>(SharedFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
