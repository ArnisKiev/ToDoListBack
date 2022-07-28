import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TaskController } from './task.controller';
import { TaskSchema } from './task.model';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'TaskEntity',
        schema: TaskSchema,
      },
    ]),
    UserModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
