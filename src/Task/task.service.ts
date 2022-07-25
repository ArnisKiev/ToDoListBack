import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IRepository } from 'src/Interfaces/IRepository.Interface';
import { UserDto } from 'src/User/dto/userDto.dto';
import { UserModel } from 'src/User/user-model';
import { UserService } from 'src/user/user.service';
import { TaskDocument, TaskModel } from './task.model';

@Injectable()
export class TaskService implements IRepository<TaskModel> {
  constructor(
    private userService: UserService,
    @InjectModel('TaskEntity') private taskModel: Model<TaskDocument>,
  ) {}

  async getCountOfTasks() {
    return await this.taskModel.count();
  }

  async create(task: TaskModel) {
    const addedTask = new this.taskModel(task);
    return await addedTask.save();
  }

  async update(item: TaskModel) {
    const _id = new mongoose.Types.ObjectId(item['id']);
    const res = await this.taskModel.findById({ _id });
    res.overwrite(item);
    return res.save();
  }
  async getItems(page: number) {
    return await this.taskModel.aggregate([
      {
        $lookup: {
          from: 'userentities',
          localField: 'authorId',
          foreignField: '_id',
          as: 'User',
        },
      },

      {
        $unwind: {
          path: '$User',
        },
      },

      {
        $project: {
          _id: 0,
          id: '$_id',
          title: 1,
          description: 1,
          author: '$User.email',
          authorId: 1,
          dueDate: 1,
          priority: 1,
          isDone: 1,
        },
      },

      {
        $sort: {
          id: -1,
        },
      },
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
    ]);
  }

  async getTasksByUserId(id: string, page: number) {
    return await this.taskModel
      .find({ authorId: id })
      .skip((page - 1) * 10)
      .limit(10)
      .exec();
  }

  async getCountTasksOfUserByEmail(email: string) {
    const user = await this.userService.findUserByEmail(email);

    if (user === null) {
      throw new BadRequestException('The user not found');
    }

    const authorId: string = user['_doc']['_id'];
    return await this.taskModel.find({ authorId }).count();
  }

  async findById(id: string): Promise<TaskModel> {
    return this.taskModel.findById(id).exec();
  }
  delete(item: TaskModel): Promise<TaskModel> {
    return this.taskModel.findOneAndDelete(item).exec();
  }

  async getTasksByUserEmail(email: string, page: number) {
    return await this.taskModel.aggregate([
      {
        $lookup: {
          from: 'userentities',
          localField: 'authorId',
          foreignField: '_id',
          as: 'User',
        },
      },

      {
        $unwind: {
          path: '$User',
        },
      },

      {
        $project: {
          _id: 0,
          id: '$_id',
          title: 1,
          description: 1,
          author: '$User.email',
          authorId: 1,
          dueDate: 1,
          priority: 1,
          isDone: 1,
        },
      },

      {
        $match: {
          author: email,
        },
      },
      {
        $sort: {
          id: -1,
        },
      },
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
    ]);
  }

  async searchTasksByKeyWord(word: string, page: number) {
    return await this.taskModel.aggregate([
      {
        $lookup: {
          from: 'userentities',
          localField: 'authorId',
          foreignField: '_id',
          as: 'User',
        },
      },

      {
        $unwind: {
          path: '$User',
        },
      },

      {
        $project: {
          _id: 0,
          id: '$_id',
          title: 1,
          description: 1,
          author: '$User.email',
          authorId: 1,
          dueDate: 1,
          priority: 1,
          isDone: 1,
        },
      },

      {
        $match: {
          $or: [
            { title: { $regex: word } },
            { description: { $regex: word } },
            { author: { $regex: word } },
          ],
        },
      },

      {
        $sort: {
          id: -1,
        },
      },
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
    ]);
  }

  async getCountOfTaskWithKeyWord(key: string) {
    return (
      await this.taskModel.aggregate([
        {
          $lookup: {
            from: 'userentities',
            localField: 'authorId',
            foreignField: '_id',
            as: 'User',
          },
        },

        {
          $unwind: {
            path: '$User',
          },
        },

        {
          $project: {
            _id: 0,
            id: '$_id',
            title: 1,
            description: 1,
            author: '$User.email',
            authorId: 1,
            dueDate: 1,
            priority: 1,
            isDone: 1,
          },
        },

        {
          $match: {
            $or: [
              { title: { $regex: key } },
              { description: { $regex: key } },
              { author: { $regex: key } },
            ],
          },
        },

        {
          $sort: {
            id: -1,
          },
        },

        {
          $count: 'count',
        },
      ])
    )[0]['count'];
  }
}
