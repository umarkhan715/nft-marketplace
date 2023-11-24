import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TicketsModule } from './tickets/tickets.module';
import { HelpCenterModule } from './help-center/help-center.module';
import { ThemeSettingModule } from './theme-setting/theme-setting.module';
import { ToolsModule } from './tools/tools.module';
import { SiteSettingModule } from './site-setting/site-setting.module';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [TicketsModule, HelpCenterModule, ThemeSettingModule, ToolsModule, SiteSettingModule],
})
export class SettingsModule {}
