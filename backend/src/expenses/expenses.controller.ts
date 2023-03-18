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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MyRequest, Optional } from 'src/types';
import { Expense } from './entities/expense.entity';
import { ExpenseStatistics } from './dto/get-expenses-statistics.dto';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Request() req: MyRequest,
  ): Promise<Expense> {
    const res = await this.expensesService.create(
      createExpenseDto,
      req.user!.id,
    );
    if (!res.ok) throw new Error(res.val.message);
    return res.val;
  }

  @Get()
  findAll(
    @Request() req: MyRequest,
    @Query('date') date: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('offset', ParseIntPipe) offset: number,
  ): Promise<Expense[]> {
    console.log({ date, limit });

    return this.expensesService.findAll(req.user!.id, limit, offset, date);
  }

  @Get('statistics')
  getStatistics(@Request() req: MyRequest): Promise<ExpenseStatistics> {
    return this.expensesService.getStatistics(req.user!.id);
  }

  @Get('statistics/yearly/:year')
  getYearlyStatistics(@Param('year') year: string, @Request() req: MyRequest) {
    return this.expensesService.getMonthlyStatisticsForAYear(
      req.user!.id,
      parseInt(year),
    );
  }

  @Get('statistics/:year/:month')
  getMonthlyStatistics(
    @Param('month') month: string,
    @Param('year') year: string,
    @Request() req: MyRequest,
  ) {
    return this.expensesService.getMonthlyStatistics(req.user!.id, year, month);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: MyRequest,
  ): Promise<Optional<Expense>> {
    return this.expensesService.findOne(id, req.user!.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req: MyRequest,
  ): Promise<Optional<Expense>> {
    return this.expensesService.update(id, updateExpenseDto, req.user!.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: MyRequest,
  ): Promise<Optional<Expense>> {
    return this.expensesService.remove(id, req.user!.id);
  }
}
