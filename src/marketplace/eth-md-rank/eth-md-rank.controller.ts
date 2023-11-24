import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EthMdRankService } from './eth-md-rank.service';
import { CreateEthMdRankDto } from './dto/create-eth-md-rank.dto';
import { UpdateEthMdRankDto } from './dto/update-eth-md-rank.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('MarketPlace/eth-md-rank')
@Controller()

export class EthMdRankController {
  constructor(private readonly ethMdRankService: EthMdRankService) {}
  @Post('add-eth-collection')
  create(@Body() createEthMdRankDto: CreateEthMdRankDto) {
    return this.ethMdRankService.create(createEthMdRankDto);
  }

  @Get('get-all-collection')
  findAll() {
    return this.ethMdRankService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ethMdRankService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateEthMdRankDto: UpdateEthMdRankDto,
  // ) {
  //   return this.ethMdRankService.update(+id, updateEthMdRankDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ethMdRankService.remove(+id);
  // }
}
