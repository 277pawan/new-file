import { Test, TestingModule } from '@nestjs/testing';
import { FolderStrucController } from './folder-struc.controller';

describe('FolderStrucController', () => {
  let controller: FolderStrucController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FolderStrucController],
    }).compile();

    controller = module.get<FolderStrucController>(FolderStrucController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
