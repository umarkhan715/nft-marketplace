import { Module } from '@nestjs/common';
import { NftBulkSenderService } from './nft-bulk-sender.service';
import { NftBulkSenderController } from './nft-bulk-sender.controller';

@Module({
  controllers: [NftBulkSenderController],
  providers: [NftBulkSenderService]
})
export class NftBulkSenderModule {}
