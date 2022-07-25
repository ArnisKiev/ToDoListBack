import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes } from 'mongoose';
import { Priority } from 'src/enums/priority.enum';
import { UserModel } from 'src/User/user-model';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TaskDocument = TaskModel & Document;

@Schema()
export class TaskModel {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop()
  description?: string;

  @ApiProperty({ description: 'foreign key for table "Users"' })
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  authorId: string;

  @ApiProperty()
  @Prop({ type: Date })
  dueDate?: Date;

  @ApiProperty({
    enum: ['Low', 'Middle', 'High'],
    description: 'Priority of task',
    default: 0,
  })
  @Prop({ type: Number, default: 0 })
  priority?: Priority;

  @ApiProperty()
  @Prop({ default: false })
  isDone: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(TaskModel);
