/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MyRequest, Optional } from 'src/types';
import { Expense } from './entities/expense.entity';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Request() req: MyRequest,
  ) {
    return this.expensesService.create(createExpenseDto, req.user!.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: MyRequest): Promise<Expense[]> {
    return this.expensesService.findAll(req.user!.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: MyRequest,
  ): Promise<Optional<Expense>> {
    return this.expensesService.findOne(id, req.user!.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    userId: string,
  ): Promise<Optional<Expense>> {
    return this.expensesService.update(id, updateExpenseDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: MyRequest,
  ): Promise<Optional<Expense>> {
    return this.expensesService.remove(id, req.user!.id);
  }
}
