import { Module } from '@nestjs/common';
import { ImguploadController } from './imgupload.controller';
import { ImguploadService } from './imgupload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadSchema } from './imgupload.models';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Module({
  controllers: [ImguploadController],
  providers: [ImguploadService],
  imports:[
   MongooseModule.forFeature([{name:"Upload",schema:UploadSchema}]),
   MulterModule.register(multerConfig),
  ]
})
export class ImguploadModule {}
