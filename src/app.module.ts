import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './task/task.controller';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://app:app-password@cluster0.2t3aq.mongodb.net/?retryWrites=true&w=majority',
    ),
    UserModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
