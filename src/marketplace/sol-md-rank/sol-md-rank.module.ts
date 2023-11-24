import { Module } from '@nestjs/common';
import { SolMdRankService } from './sol-md-rank.service';
import { SolMdRankController } from './sol-md-rank.controller';
import { DbConnectionModule } from '../../db-connection/db-connection.module';

@Module({
  controllers: [SolMdRankController],
  providers: [SolMdRankService],
  imports: [DbConnectionModule, SolMdRankModule],
})
export class SolMdRankModule {}
