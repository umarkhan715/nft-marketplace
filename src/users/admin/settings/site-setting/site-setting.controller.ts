import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { SiteSettingService } from "./site-setting.service";
import { CreateSiteSettingDto } from "./dto/create-site-setting.dto";
import { UpdateSiteSettingDto } from "./dto/update-site-setting.dto";
import { SiteSettingImgValidator } from "src/common/decorator/siteSettingImgValidator";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("setting/site-setting")
@Controller()
export class SiteSettingController {
  constructor(private readonly siteSettingService: SiteSettingService) {}

  @Post("add")
  @UseInterceptors(SiteSettingImgValidator)
  create(
    @UploadedFiles() file: Express.Multer.File,
    @Body() createSiteSettingDto: CreateSiteSettingDto
  ) {
    return this.siteSettingService.create(createSiteSettingDto, file);
  }
}
