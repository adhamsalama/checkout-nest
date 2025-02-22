export type Expense = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  tags: string[];
  comment?: string;
  date: string;
  sellerName?: string;
  userId: string;
};

export type MonthlyBudget = {
  id: number;
  value: number;
  date: Date
}

export type User = { _id: string; email: string; balance: number };
