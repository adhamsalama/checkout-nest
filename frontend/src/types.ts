export type Expense = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  tags: string[];
  comment?: string;
  date: string;
  sellerName?: string;
  userId: string;
};

export type User = { _id: string; email: string; balance: number };
