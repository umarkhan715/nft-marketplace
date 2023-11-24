import { Module } from '@nestjs/common';
import { HelpCenterService } from './help-center.service';
import { HelpCenterController } from './help-center.controller';

@Module({
  controllers: [HelpCenterController],
  providers: [HelpCenterService]
})
export class HelpCenterModule {}
