import { Module } from '@nestjs/common';
import { EthGeneratorService } from './eth-generator.service';
import { EthGeneratorController } from './eth-generator.controller';
import { DbConnectionModule } from '../../db-connection/db-connection.module';

@Module({
  controllers: [EthGeneratorController],
  providers: [EthGeneratorService],
  imports: [DbConnectionModule],
})
export class EthGeneratorModule {}
