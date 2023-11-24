import { Module } from '@nestjs/common';
import { ButtonService } from './button.service';
import { ButtonController } from './button.controller';
import { DbConnectionModule } from '../../../../../db-connection/db-connection.module';

@Module({
  controllers: [ButtonController],
  providers: [ButtonService],
  imports: [DbConnectionModule],
})
export class ButtonModule {}
