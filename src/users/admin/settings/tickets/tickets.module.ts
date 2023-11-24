import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { SendgridService } from 'src/EmailService/sendGrid.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService,SendgridService]
})
export class TicketsModule {}
