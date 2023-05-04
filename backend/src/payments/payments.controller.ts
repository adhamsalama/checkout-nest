import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types';
import { Payment } from './entities/payment.entity';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Payment> {
    const payment = await this.paymentsService.create(
      createPaymentDto,
      req.user.id,
    );
    if (payment.isErr()) throw new Error(payment.error);
    return payment.value;
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.paymentsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const payment = await this.paymentsService.findOne(id, req.user.id);
    if (!payment) throw new Error('Payment not found');
    return payment;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const result = await this.paymentsService.update(
      id,
      req.user.id,
      updatePaymentDto,
    );
    return result._unsafeUnwrap();
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Payment> {
    const result = await this.paymentsService.remove(id, req.user.id);
    return result._unsafeUnwrap();
  }
}
