import { Module } from '@nestjs/common';
import { DbConnectionService } from './db-connection.service';

@Module({
  providers: [DbConnectionService],
  exports: [DbConnectionService],
})
export class DbConnectionModule {}
