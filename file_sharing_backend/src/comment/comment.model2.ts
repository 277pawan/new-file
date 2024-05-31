import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  userid: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  feedback: string;
}
export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);

