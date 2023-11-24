import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SolGeneratorService } from "./sol-generator.service";
import { CreateSolGeneratorDto } from "./dto/create-sol-generator.dto";

@ApiTags("LauchPad/Sol-generator")
@Controller()
export class SolGeneratorController {
  constructor(private readonly solGeneratorService: SolGeneratorService) {}
  @Post()
  create(@Body() createSolGeneratorDto: CreateSolGeneratorDto) {
    return this.solGeneratorService.create(createSolGeneratorDto);
  }

  @Get()
  findAll() {
    return this.solGeneratorService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.solGeneratorService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSolGeneratorDto: UpdateSolGeneratorDto,
  // ) {
  //   return this.solGeneratorService.update(+id, updateSolGeneratorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.solGeneratorService.remove(+id);
  // }
}
