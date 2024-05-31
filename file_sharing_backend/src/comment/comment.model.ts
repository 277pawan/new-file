import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Comment, CommentSchema } from './comment.model2';

@Schema({ timestamps: true })
export class View {
  @Prop({ type: String, required: true })
  fileId: string;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export type ViewDocument = View & Document;
export const ViewSchema = SchemaFactory.createForClass(View);

