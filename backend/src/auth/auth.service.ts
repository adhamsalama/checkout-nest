import { Injectable } from '@nestjs/common';
import { Optional } from 'src/types';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<Optional<User>> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }
  async login(user: User) {
    // @ts-ignore
    const payload = { email: user.email, sub: user._id, balance: user.balance };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
