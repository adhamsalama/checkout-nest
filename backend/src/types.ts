import { Request } from 'express';
import { Expense } from './expenses/entities/expense.entity';

export type Optional<T> = T | null;
export type UserPayload = { id: string; email: string };
export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

export type ExpenseStatistics = {
  _id: string;
  count: number;
  maxPrice: number;
  minPrice: number;
  avgPrice: number;
  totalPrice: number;
  maxItems: Expense[];
};
