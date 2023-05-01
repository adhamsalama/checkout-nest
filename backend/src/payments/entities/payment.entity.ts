import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
  @Prop()
  name: string;

  @Prop()
  value: number;

  @Prop()
  date: Date;

  @Prop()
  sellerName?: string;

  @Prop()
  userId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ _id: 1, userId: 1 });
