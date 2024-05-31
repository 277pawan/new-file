import { Test, TestingModule } from '@nestjs/testing';
import { ImguploadService } from './imgupload.service';

describe('ImguploadService', () => {
  let service: ImguploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImguploadService],
    }).compile();

    service = module.get<ImguploadService>(ImguploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
