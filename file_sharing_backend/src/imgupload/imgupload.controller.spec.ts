import { Test, TestingModule } from '@nestjs/testing';
import { ImguploadController } from './imgupload.controller';

describe('ImguploadController', () => {
  let controller: ImguploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImguploadController],
    }).compile();

    controller = module.get<ImguploadController>(ImguploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
