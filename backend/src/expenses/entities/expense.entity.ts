import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({ validateBeforeSave: true })
export class Expense {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop([String])
  tags: string[];

  @Prop()
  comment?: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  sellerName?: string;

  @Prop({ required: true })
  userId: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
console.log({ ExpenseSchema: JSON.stringify(ExpenseSchema) });

ExpenseSchema.index({ userId: 1 });
ExpenseSchema.index({ _id: 1, userId: 1 });
