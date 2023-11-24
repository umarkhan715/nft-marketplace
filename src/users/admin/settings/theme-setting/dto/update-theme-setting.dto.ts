import { PartialType } from '@nestjs/swagger';
import { CreateThemeSettingDto } from './create-theme-setting.dto';

export class UpdateThemeSettingDto extends PartialType(CreateThemeSettingDto) {}
