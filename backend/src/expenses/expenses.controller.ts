/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest, Optional } from 'src/types';
import { Expense } from './entities/expense.entity';
import { ExpenseStatistics } from './dto/get-expenses-statistics.dto';
import { ValidationPipe } from './validation.pipe';
import { ExpenseSearch } from './dto/search-expense.dto';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Expense> {
    const res = await this.expensesService.create(
      createExpenseDto,
      req.user.id,
    );
    if (!res.ok) throw new Error(res.val.message);
    return res.val;
  }

  @Get()
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query(new ValidationPipe()) search?: ExpenseSearch,
  ): Promise<Expense[]> {
    return this.expensesService.findAll({
      userId: req.user.id,
      ...search,
    });
  }

  @Get('statistics')
  getStatistics(
    @Request() req: AuthenticatedRequest,
  ): Promise<ExpenseStatistics> {
    return this.expensesService.getStatistics(req.user.id);
  }

  @Get('statistics/yearly/:year')
  getYearlyStatistics(
    @Param('year') year: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.expensesService.getMonthlyStatisticsForAYear(
      req.user.id,
      parseInt(year),
    );
  }

  @Get('statistics/:year/:month')
  getMonthlyStatistics(
    @Param('month') month: string,
    @Param('year') year: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.expensesService.getMonthlyStatistics(req.user.id, year, month);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Optional<Expense>> {
    return this.expensesService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Expense> {
    const result = await this.expensesService.update(
      id,
      updateExpenseDto,
      req.user.id,
    );
    if (!result) {
      throw new NotFoundException('Expense not found');
    }
    return result;
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Optional<Expense>> {
    return this.expensesService.remove(id, req.user.id);
  }
}
