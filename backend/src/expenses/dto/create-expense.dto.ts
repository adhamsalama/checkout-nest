export class CreateExpenseDto {
  name: string;
  price: number;
  quantity: number;
  tags: string[];
  comment?: string;
  date: Date;
  sellerName?: string;
}
