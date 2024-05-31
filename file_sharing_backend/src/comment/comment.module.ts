import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { View,ViewSchema } from './comment.model';
import { CommentsService } from './comment.service';
import { CommentsController } from './comment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: View.name, schema: ViewSchema }]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}