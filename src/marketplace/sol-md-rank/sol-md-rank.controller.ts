import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SolMdRankService } from './sol-md-rank.service';
import { CreateSolMdRankDto } from './dto/create-sol-md-rank.dto';
import { UpdateSolMdRankDto } from './dto/update-sol-md-rank.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('marketplace/sol-md-rank')
@Controller()
export class SolMdRankController {
  constructor(private readonly solMdRankService: SolMdRankService) {}

  @Post('sol-collection')
  create(@Body() createSolMdRankDto: CreateSolMdRankDto) {
    return this.solMdRankService.create(createSolMdRankDto);
  }

  // @Get()
  // findAll() {
  //   return this.solMdRankService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.solMdRankService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSolMdRankDto: UpdateSolMdRankDto,
  // ) {
  //   return this.solMdRankService.update(+id, updateSolMdRankDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.solMdRankService.remove(+id);
  // }
}
