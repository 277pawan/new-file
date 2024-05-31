import { Test, TestingModule } from '@nestjs/testing';
import { ShareFileController } from './share-file.controller';

describe('ShareFileController', () => {
  let controller: ShareFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShareFileController],
    }).compile();

    controller = module.get<ShareFileController>(ShareFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
