import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BiddingService } from './bidding.service';
import { CreateBiddingDto } from './dto/create-bidding.dto';
import { UpdateBiddingDto } from './dto/update-bidding.dto';

@ApiTags('MarketPlace/Bidding')
@Controller()
export class BiddingController {
  constructor(private readonly biddingService: BiddingService) {}

  @Post('/create')
  createbidding(@Body() createBiddingDto: CreateBiddingDto) {
    return this.biddingService.createbidding(createBiddingDto);
  }

  @Get('/')
  //@UseInterceptors(CacheInterceptor)
  //@CacheKey('getallbidding')
  //@CacheTTL(0)
  findAllBids() {
    return this.biddingService.findAllBids();
  }

  @Get(':id')
  //@UseInterceptors(CacheInterceptor)
  // @CacheKey('getsinglebid')
  // @CacheTTL(0)
  findBid(@Param('id') id: string) {
    return this.biddingService.findBid(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBiddingDto: UpdateBiddingDto) {
    return this.biddingService.update(id, updateBiddingDto);
  }

  @Delete(':id')
  deleteBid(@Param('id') id: string) {
    return this.biddingService.deleteBid(id);
  }
}
