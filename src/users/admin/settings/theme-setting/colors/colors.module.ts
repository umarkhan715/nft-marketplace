import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { DbConnectionModule } from '../../../../../db-connection/db-connection.module';

@Module({
  controllers: [ColorsController],
  providers: [ColorsService],
  imports: [DbConnectionModule],
})
export class ColorsModule {}
