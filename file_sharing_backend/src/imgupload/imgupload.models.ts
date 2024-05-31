import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true })
export class Upload {
  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
