import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema({timestamps:true})
export class User {
    @Prop({required:true})
    username:string;

    @Prop({required:true})
    useremail:string;

    @Prop({required:true})
    userpassword:string;

    @Prop()
    image:string;
    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.userpassword);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
