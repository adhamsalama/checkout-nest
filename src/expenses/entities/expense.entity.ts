// export class Expense {
// name: string;
// price: number;
// quantity: number;
// tags: string[];
// comment?: string;
// date: Date;
// sellerName?: string;
// userId: string;
// }
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop([String])
  tags: string[];

  @Prop()
  comment?: string;

  @Prop()
  date: Date;

  @Prop()
  sellerName?: string;

  @Prop()
  userId: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

ExpenseSchema.index({ _id: 1, userId: 1 });
