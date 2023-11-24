import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { DbConnectionModule } from '../db-connection/db-connection.module';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService],
  imports: [DbConnectionModule],
})
export class CalendarModule {}
