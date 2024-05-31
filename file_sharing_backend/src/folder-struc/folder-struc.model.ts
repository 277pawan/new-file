import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class FolderStruc {
  @Prop({ type: MongooseSchema.Types.Mixed, required: true,select:true })
  folder: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;
}

export type FolderStrucDocument = FolderStruc & Document;
export const FolderStrucSchema = SchemaFactory.createForClass(FolderStruc);
