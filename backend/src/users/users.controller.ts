import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Optional } from 'src/types';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.usersService.create(createUserDto);
    if (!result.ok) {
      return res.status(400).json({ message: result.val.message });
    }

    return res.status(201).json({ ...result.val });
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Optional<User> {
  //   return this.usersService.update(id, updateUserDto);
  // }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
