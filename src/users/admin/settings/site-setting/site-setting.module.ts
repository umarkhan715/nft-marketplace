import { Module } from '@nestjs/common';
import { SiteSettingService } from './site-setting.service';
import { SiteSettingController } from './site-setting.controller';
import { DbConnectionModule } from '../../../../db-connection/db-connection.module';

@Module({
  controllers: [SiteSettingController],
  providers: [SiteSettingService],
  imports: [DbConnectionModule],
})
export class SiteSettingModule {}
