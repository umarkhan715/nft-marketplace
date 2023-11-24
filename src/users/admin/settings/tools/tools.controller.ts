import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ToolsService } from "./tools.service";
import { CreateToolDto } from "./dto/create-tool.dto";
import { UpdateToolDto } from "./dto/update-tool.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("setting/tools")
@Controller()
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolsService.create(createToolDto);
  }

  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.toolsService.remove(id);
  }
}
