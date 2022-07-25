import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { Model } from 'mongoose';
import { IRepository } from 'src/Interfaces/IRepository.Interface';
import { UserDto } from './dto/userDto.dto';
import { UserDocument, UserModel } from './user-model';

@Injectable()
export class UserService implements IRepository<UserModel> {
  constructor(
    @InjectModel('UserEntity')
    private userModel: Model<UserDocument>,
  ) {}

  async create(user: UserDto): Promise<UserModel> {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: user.email,
      passwordHash: await hash(user.password, salt), //create hash for password
    });
    return newUser.save();
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  update(item: UserModel): Promise<UserModel> {
    throw new Error('Method not implemented.');
  }
  getItems(page: number): Promise<UserModel[]> {
    return this.userModel
      .aggregate()
      .skip((page - 1) * 10)
      .limit(10)
      .exec();
  }
  findById(id: string): Promise<UserModel> {
    return this.userModel.findById(id).exec();
  }
  async delete(item: UserModel) {
    return await this.userModel.deleteOne(item).exec();
  }
}
