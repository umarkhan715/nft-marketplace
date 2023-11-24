import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ThemeSettingService } from "./theme-setting.service";
import { CreateThemeSettingDto } from "./dto/create-theme-setting.dto";
import { UpdateThemeSettingDto } from "./dto/update-theme-setting.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Theme-setting")
@Controller()
export class ThemeSettingController {
  constructor(private readonly themeSettingService: ThemeSettingService) {}
}
