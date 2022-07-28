import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Guards/jwt.guard';
import { TaskModel } from './task.model';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskModel: TaskService) {}

  @ApiQuery({
    name: 'page',
    description: 'search tasks of user,that have the same email',
  })
  @Get()
  async getTasks(@Query('page') page: number = 1) {
    const tasks = await this.taskModel.getItems(page);
    const countOfTasks = await this.taskModel.getCountOfTasks();

    return {
      tasks,
      count: countOfTasks,
    };
  }

  @ApiBody({ type: [TaskModel] })
  @Post()
  async addTask(@Body() task: TaskModel) {
    return await this.taskModel.create(task);
  }

  @ApiQuery({
    name: 'email',
    description: 'search tasks of user,that have the same email',
  })
  @ApiQuery({
    name: 'page',
    description: 'param, that we use for pagination of date. Default value: 1',
  })
  @Get('userTasks')
  async getTasksByUserEmail(
    @Query('email') email: string,
    @Query('page') page: number = 1,
  ) {
    const tasks = await this.taskModel.getTasksByUserEmail(email, page);
    const count = await this.taskModel.getCountTasksOfUserByEmail(email);

    return {
      tasks,
      count,
    };
  }

  @ApiQuery({
    name: 'key',
    description: 'key is a substring of title, description or user`s email',
  })
  @ApiQuery({
    name: 'page',
    description: 'param, that we use for pagination of date. Default value: 1',
  })
  @Get('searchTaskByKeyWord')
  async getTasksByKeyWord(
    @Query('key') key: string,
    @Query('page') page: number = 1,
  ) {
    const tasks = await this.taskModel.searchTasksByKeyWord(key, page);

    const count = await this.taskModel.getCountOfTaskWithKeyWord(key);
    return { tasks, count };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateTask(@Body() task: TaskModel) {
    return await this.taskModel.update(task);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteTask(@Body() task: TaskModel) {
    return await this.taskModel.delete(task);
  }
}
