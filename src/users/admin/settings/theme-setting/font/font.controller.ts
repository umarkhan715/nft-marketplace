import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { FontService } from "./font.service";
import { CreateFontDto } from "./dto/create-font.dto";
import { UpdateFontDto } from "./dto/update-font.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Theme-setting/font")
@Controller()
export class FontController {
  constructor(private readonly fontService: FontService) {}

  @Post()
  create(@Body() createFontDto: CreateFontDto) {
    return this.fontService.create(createFontDto);
  }

  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.fontService.remove(id);
  }
}
