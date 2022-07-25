import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { TaskTransformerService } from './task.transformer.service';

@Module({
  imports: [UserModule],
  providers: [TaskTransformerService],
  exports: [TaskTransformerService],
})
export class TaskTransformerModule {}
