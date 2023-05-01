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
    const payment: Payment = { ...createPaymentDto, userId };
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

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
