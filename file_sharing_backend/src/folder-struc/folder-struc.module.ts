import { Module } from '@nestjs/common';
import { FolderStrucController } from './folder-struc.controller';
import { FolderStrucService } from './folder-struc.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderStruc, FolderStrucSchema } from './folder-struc.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: FolderStruc.name, schema: FolderStrucSchema }])],
  controllers: [FolderStrucController],
  providers: [FolderStrucService]
})
export class FolderStrucModule {}
