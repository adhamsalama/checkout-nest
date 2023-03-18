import { Expense } from '../entities/expense.entity';

// Nest Swagger OpenAPI CLI plugin only works with *.dto.ts or *.entity.ts CLASSES
export class ExpenseStatistics {
  _id: string;
  count: number;
  maxPrice: number;
  minPrice: number;
  avgPrice: number;
  totalPrice: number;
  maxItems: Expense[];
}
