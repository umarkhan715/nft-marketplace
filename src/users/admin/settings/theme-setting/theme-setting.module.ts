import { Module } from '@nestjs/common';
import { ThemeSettingService } from './theme-setting.service';
import { ThemeSettingController } from './theme-setting.controller';
import { ColorsModule } from './colors/colors.module';
import { ButtonModule } from './button/button.module';
import { FontModule } from './font/font.module';

@Module({
  controllers: [ThemeSettingController],
  providers: [ThemeSettingService],
  imports: [ColorsModule, ButtonModule, FontModule]
})
export class ThemeSettingModule {}
