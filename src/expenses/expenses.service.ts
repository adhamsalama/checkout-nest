import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Optional } from 'src/types';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense, ExpenseDocument } from './entities/expense.entity';
import { Ok, Err, Result, ioresult } from 'ioresult';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<Result<Expense, Error>> {
    const expense: Expense = { ...createExpenseDto, userId };
    const result = await ioresult(this.expenseModel.create(expense));
    if (!result.ok) return new Err(result.val);
    return new Ok(result.val);
  }

  async findAll(userId: string): Promise<Expense[]> {
    return this.expenseModel.find({ userId });
  }

  async findOne(id: string, userId: string): Promise<Optional<Expense>> {
    return this.expenseModel.findOne({ _id: id, userId });
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    userId: string,
  ): Promise<Optional<Expense>> {
    return this.expenseModel.findOneAndUpdate(
      { _id: id, userId },
      { ...updateExpenseDto },
      { new: true },
    );
  }

  async remove(id: string, userId: string): Promise<Optional<Expense>> {
    return this.expenseModel.findOneAndDelete({ _id: id, userId });
  }
}
