import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseStatistics, Optional } from 'src/types';
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

  async findAll({
    userId,
    name,
    priceGte,
    priceLte,
    tags,
    limit = 20,
    offset = 0,
    startDate,
    endDate,
  }: {
    userId: string;
    priceGte?: number;
    priceLte?: number;
    name?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Expense[]> {
    const priceSearch: { $gte?: number; $lte?: number } = {};
    if (priceGte) priceSearch.$gte = priceGte;
    if (priceLte) priceSearch.$lte = priceLte;
    const dateSearch: { $gte?: Date; $lte?: Date } = {};
    if (startDate) {
      dateSearch.$gte = new Date(startDate);
    }
    if (endDate) {
      dateSearch.$lte = new Date(endDate);
    }
    return this.expenseModel
      .find({
        userId,
        ...(name && { name: { $regex: name } }),
        ...(Object.keys(dateSearch).length && {
          date: {
            ...dateSearch,
          },
        }),
        ...(Object.keys(priceSearch).length && {
          price: { ...priceSearch },
        }),

        ...(tags && { tags }),
      })
      .skip(offset)
      .limit(limit)
      .sort({ date: -1 });
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
      { ...updateExpenseDto, userId },
      { new: true },
    );
  }

  async remove(id: string, userId: string): Promise<Optional<Expense>> {
    return this.expenseModel.findOneAndDelete({ _id: id, userId });
  }

  async getStatistics(userId: string): Promise<ExpenseStatistics> {
    return this.expenseModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $unwind: {
          path: '$tags',
        },
      },
      {
        $group: {
          _id: '$tags',
          count: {
            $sum: 1,
          },
          items: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $addFields: {
          maxPrice: {
            $max: '$items.price',
          },
          minPrice: {
            $min: '$items.price',
          },
          avgPrice: {
            $avg: '$items.price',
          },
          totalPrice: {
            $sum: '$items.price',
          },
        },
      },
      {
        $addFields: {
          maxItems: {
            $filter: {
              input: '$items',
              as: 'item',
              cond: {
                $eq: ['$$item.price', '$$ROOT.maxPrice'],
              },
            },
          },
          // tag: '$_id',
        },
      },
      {
        $project: {
          items: 0,
        },
      },
      {
        $sort: {
          totalPrice: -1,
          count: -1,
        },
      },
    ]) as unknown as ExpenseStatistics;
  }

  async getMonthlyStatisticsForAYear(userId: string, year: number) {
    const data: { _id: number; sum: number }[] =
      await this.expenseModel.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $addFields: {
            month: {
              $month: '$date',
            },
          },
        },
        {
          $group: {
            _id: '$month',
            sum: {
              $sum: '$price',
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
    console.log({ data });

    for (let i = 1; i <= 12; i++) {
      if (!data.find((month) => month._id == i)) {
        data.splice(i - 1, 0, { _id: i, sum: 0 });
      }
    }
    console.log({ data });

    return data;
  }
  async getMonthlyStatistics(userId, year: string, month: string) {
    const data: { _id: number; sum: number }[] =
      await this.expenseModel.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: new Date(`${year}-${month}-01`),
              $lte: new Date(`${year}-${month}-31`),
            },
          },
        },
        {
          $addFields: {
            day: {
              $dayOfMonth: '$date',
            },
          },
        },
        {
          $group: {
            _id: '$day',
            sum: {
              $sum: '$price',
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);
    const paddedData: { _id: number; sum: number }[] = [];
    for (let i = 1; i <= 31; i++) {
      const d = data.find((day) => day._id === i);
      paddedData.push(d ?? { _id: i, sum: 0 });
    }
    return paddedData;
  }
}
