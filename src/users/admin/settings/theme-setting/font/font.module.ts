import { Module } from '@nestjs/common';
import { FontService } from './font.service';
import { FontController } from './font.controller';
import { DbConnectionModule } from '../../../../../db-connection/db-connection.module';

@Module({
  controllers: [FontController],
  providers: [FontService],
  imports: [DbConnectionModule],
})
export class FontModule {}
