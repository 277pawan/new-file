import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SharedFileDocument = SharedFile & Document;
@Schema()
export class SharedFile {
  @Prop({ required: true, type: Types.ObjectId, ref: 'File' })
  fileId: Types.ObjectId;

  @Prop({ required: true, type: [String], ref: 'User' }) // Change type to String
  userArray: string[]; // Change type to string array

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const SharedFileSchema = SchemaFactory.createForClass(SharedFile);
