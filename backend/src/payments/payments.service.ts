import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { Err, Ok, Result } from 'neverthrow';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private usersService: UsersService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    userId: string,
  ): Promise<Result<Payment, string>> {
    const payment: Omit<Payment, '_id'> = { ...createPaymentDto, userId };
    const createdPayment = await this.paymentModel.create(payment);
    const user = await this.usersService.updateBalance(
      userId,
      createPaymentDto.value,
    );
    if (!user.ok) return new Err(user.val);
    console.log({ user, createdPayment });
    return new Ok(createdPayment);
  }

  async findAll(userId: string): Promise<Payment[]> {
    return this.paymentModel.find({ userId });
  }

  async findOne(id: string, userId: string): Promise<Payment | null> {
    return this.paymentModel.findOne({ _id: id, userId });
  }

  async update(
    id: string,
    userId: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Result<Payment, string>> {
    const payment = await this.paymentModel.findByIdAndUpdate(
      {
        _id: id,
        userId,
      },
      updatePaymentDto,
      { new: false },
    );
    console.log({ updatePaymentDto, payment });

    if (!payment) return new Err('Payment not found');
    if (
      updatePaymentDto.value !== null &&
      updatePaymentDto.value !== undefined
    ) {
      const result = await this.usersService.updateBalance(
        userId,
        updatePaymentDto.value - payment.value,
      );
      if (!result.ok) return new Err(result.val);
    }
    return new Ok(payment);
  }

  async remove(id: string, userId: string): Promise<Result<Payment, string>> {
    const payment = await this.paymentModel.findOneAndDelete({
      _id: id,
      userId,
    });
    if (!payment) return new Err('Payment not found');
    await this.usersService.updateBalance(userId, -payment.value);
    return new Ok(payment);
  }
}
