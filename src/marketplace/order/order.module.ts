import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DbConnectionModule } from '../../db-connection/db-connection.module';

@Module({
  imports: [DbConnectionModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
