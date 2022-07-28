import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserModel & Document;

@Schema()
export class UserModel {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, unique: true })
  passwordHash: string;
}

export const UserScheme = SchemaFactory.createForClass(UserModel);
