import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ColorsService } from "./colors.service";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Theme-setting/colors")
@Controller()
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.colorsService.remove(id);
  }
}
