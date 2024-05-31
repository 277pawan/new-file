import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedFileService } from './share-file.service';
import { SharedFile, SharedFileSchema } from './share-file.model';
import { UsersModule } from '../users/users.module'; // Import UsersModule
import { ShareFileController } from './share-file.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SharedFile.name, schema: SharedFileSchema }]),
    UsersModule, // Add UsersModule here
  ],
  providers: [SharedFileService],
  controllers: [ShareFileController],
  exports: [MongooseModule.forFeature([{ name: SharedFile.name, schema: SharedFileSchema }])]
})
export class ShareFileModule {}
