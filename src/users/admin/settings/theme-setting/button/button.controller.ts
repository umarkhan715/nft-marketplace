import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ButtonService } from "./button.service";
import { CreateButtonDto } from "./dto/create-button.dto";
import { UpdateButtonDto } from "./dto/update-button.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Theme-setting/button")
@Controller()
export class ButtonController {
  constructor(private readonly buttonService: ButtonService) {}

  @Post()
  create(@Body() createButtonDto: CreateButtonDto) {
    return this.buttonService.create(createButtonDto);
  }

  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.buttonService.remove(id);
  }
}
