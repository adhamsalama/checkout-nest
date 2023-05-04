import { User } from '../entities/user.entity';

export class GetUserDto {
  _id: string;
  email: string;
  name: string;
  balance: number;

  constructor(user: User) {
    this._id = user._id;
    this.email = user.email;
    this.name = user.name;
    this.balance = user.balance;
  }
}
