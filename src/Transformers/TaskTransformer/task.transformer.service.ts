import { Injectable } from '@nestjs/common';
import { async } from 'rxjs';
import { TaskModel } from 'src/task/task.model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskTransformerService {
  constructor(private userService: UserService) {}

  private async generateResponseTask(task: TaskModel) {
    return {
      id: task['_id'],
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      isDone: task.isDone,
      author: (await this.userService.findById(task.authorId)).email,
      authorId: task.authorId,
    };
  }

  async generateResponseTasks(tasks: TaskModel[]) {
    let transformedTasks = [];

    for (let task of tasks) {
      transformedTasks.push(await this.generateResponseTask(task));
    }

    return transformedTasks;
  }
}
