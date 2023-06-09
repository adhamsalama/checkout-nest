import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Result, ioresult, Err, Ok } from 'ioresult';
import { Model } from 'mongoose';
import { Optional } from 'src/types';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Result<UserDocument, Error>> {
    const user: Omit<User, '_id'> = { ...createUserDto, balance: 0 };
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    user.password = hashedPassword;
    const result = await ioresult(this.userModel.create(user));
    if (!result.ok) return new Err(result.val);
    return new Ok(result.val);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({});
  }

  async findOne(id: string): Promise<Optional<UserDocument>> {
    return this.userModel.findById(id);
  }

  async findOneByEmail(email: string): Promise<Optional<UserDocument>> {
    return this.userModel.findOne({ email });
  }
  // update(id: number, updateUserDto: UpdateUserDto): Optional<User> {
  //   const user = this.findOne(id);
  //   if (!user) return null;
  //   user.email = updateUserDto.email ?? user.email;
  //   user.name = updateUserDto.name ?? user.name;
  //   return user;
  // }

  async updateBalance(
    id: string,
    amount: number,
  ): Promise<Result<UserDocument, string>> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      { $inc: { balance: amount } },
    );
    if (!user) return new Err('User not found');
    return new Ok(user);
  }
  async remove(id: string): Promise<Optional<UserDocument>> {
    return this.userModel.findByIdAndDelete(id);
  }
}
