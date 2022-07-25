import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskModel } from './task.model';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private taskModel: TaskService) {}

  @Get()
  async getTasks(@Query('page') page: number = 1) {
    const tasks = await this.taskModel.getItems(page);
    const countOfTasks = await this.taskModel.getCountOfTasks();

    return {
      tasks,
      count: countOfTasks,
    };
  }

  @Post()
  async addTask(@Body() task: TaskModel) {
    return await this.taskModel.create(task);
  }

  @Get('userTasks')
  async getTasksByUserEmail(@Query() params) {
    const tasks = await this.taskModel.getTasksByUserEmail(
      params['email'],
      params['page'],
    );

    const count = await this.taskModel.getCountTasksOfUserByEmail(
      params['email'],
    );

    return {
      tasks,
      count,
    };
  }

  @Get('searchTaskByKeyWord')
  async getTasksByKeyWord(@Query() params) {
    if (params['page'] == NaN) {
      params['page'] = 1;
    }

    const tasks = await this.taskModel.searchTasksByKeyWord(
      params['key'],
      params['page'],
    );

    const count = await this.taskModel.getCountOfTaskWithKeyWord(params['key']);
    return { tasks, count };
  }

  @Put()
  async updateTask(@Body() task: TaskModel) {
    return await this.taskModel.update(task);
  }

  @Delete()
  async deleteTask(@Body() task: TaskModel) {
    return await this.taskModel.delete(task);
  }
}
