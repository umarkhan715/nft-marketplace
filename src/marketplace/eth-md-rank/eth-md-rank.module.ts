import { Module } from '@nestjs/common';
import { EthMdRankService } from './eth-md-rank.service';
import { EthMdRankController } from './eth-md-rank.controller';
import { DbConnectionModule } from '../../db-connection/db-connection.module';

@Module({
  controllers: [EthMdRankController],
  providers: [EthMdRankService],
  imports: [DbConnectionModule, EthMdRankModule],
})
export class EthMdRankModule {}
